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
    // Persist user message to DB (if user is authenticated)
    if (req.user?.id) {
      await query(
        'INSERT INTO chat_history (user_id, role, content) VALUES ($1,$2,$3)',
        [req.user.id, 'user', message]
      ).catch(() => {}); // non-critical — don't fail the chat if DB write fails
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "🤖 Chatbot is not configured yet. Please add your GEMINI_API_KEY to the backend .env file.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Build chat history in Gemini format
    const formattedHistory = history
      .filter(h => h.role && h.content)
      .map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      }));

    const chatSession = model.startChat({ history: formattedHistory });
    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();

    // Persist assistant reply
    if (req.user?.id) {
      await query(
        'INSERT INTO chat_history (user_id, role, content) VALUES ($1,$2,$3)',
        [req.user.id, 'model', reply]
      ).catch(() => {});
    }

    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    res.status(500).json({ message: 'Chat service error. Please try again.', error: err.message });
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
