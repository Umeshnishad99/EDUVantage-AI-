const { GoogleGenerativeAI } = require('@google/generative-ai');
const { query } = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');



const SYSTEM_INSTRUCTION = `You are EduBot, an intelligent and friendly academic advisor for the EduVantage AI platform. 
You help students with:
- Understanding their academic performance and GPA predictions
- Navigating the platform features (Recommendations, Roadmap, Performance Form)
- General study strategies, time management tips, and motivation
- Career guidance for engineering/science students

Keep answers concise, encouraging, and actionable. Use emojis occasionally. 
If asked about specific student data, remind them to check their Student Dashboard.`;

// POST /api/chat
const chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    if (req.user?.id) {
      await query(
        'INSERT INTO chat_history (user_id, role, content) VALUES ($1,$2,$3)',
        [req.user.id, 'user', message]
      ).catch(() => {});
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "🤖 Chatbot is not configured yet. Please add your GEMINI_API_KEY to the backend .env file.",
      });
    }

    let model;
    try {
      model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
      });
    } catch (e) {
      console.warn('⚠️ Gemini 1.5 Flash failed, falling back to Gemini Pro');
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }


    const formattedHistory = history
      .filter(h => h.role && h.content)
      .map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      }));

    let result;
    try {
      const chatSession = model.startChat({ history: formattedHistory });
      result = await chatSession.sendMessage(message);
    } catch (chatErr) {
      if (chatErr.message.includes('404')) {
        console.warn('🔄 Primary model 404 error, retrying with gemini-pro...');
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const fallbackSession = fallbackModel.startChat({ history: formattedHistory });
        result = await fallbackSession.sendMessage(message);
      } else {
        throw chatErr;
      }
    }
    
    const reply = result.response.text();

    if (req.user?.id) {
      await query(
        'INSERT INTO chat_history (user_id, role, content) VALUES ($1,$2,$3)',
        [req.user.id, 'model', reply]
      ).catch(() => {});
    }


    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat error details:', err);
    res.status(500).json({ 
      message: 'Chat service error.', 
      error: err.message,
      suggestion: 'Check if your GEMINI_API_KEY is valid and supports gemini-1.5-flash.'
    });
  }
};


// GET /api/chat/history  (recent 50 messages for logged-in user)
const getChatHistory = async (req, res) => {
  try {
    if (!req.user?.id) return res.json([]);
    const result = await query(
      'SELECT role, content, created_at FROM chat_history WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(result.rows.reverse());
  } catch (e) {
    console.error(e);
    res.json([]);
  }
};

module.exports = { chat, getChatHistory };
