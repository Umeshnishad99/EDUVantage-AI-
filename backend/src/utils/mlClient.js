const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => globalThis.fetch(...args));

/**
 * Robustly call ML API with automatic IP fallback (127.0.0.1 <-> localhost)
 * @param {Object} mlBody 
 * @returns {Promise<Object>}
 */
const predictPerformance = async (mlBody) => {
  const envUrl = (process.env.ML_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
  
  // Construct URLs to try
  let primaryUrl = envUrl;
  if (!primaryUrl.endsWith('/predict')) primaryUrl += '/predict';

  const secondaryUrl = primaryUrl.includes('127.0.0.1')
    ? primaryUrl.replace('127.0.0.1', 'localhost')
    : primaryUrl.replace('localhost', '127.0.0.1');

  const urlsToTry = [primaryUrl, secondaryUrl];
  let lastError = null;

  for (const url of urlsToTry) {
    try {
      console.log(`🤖 [ML Client] Calling ML API: ${url}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlBody),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ [ML Client] Success from ${url}: GPA = ${data.predicted_gpa}, Category = ${data.category}`);
        return data;
      } else {
        const errText = await res.text();
        console.error(`❌ [ML Client] Error response (${res.status}) from ${url}:`, errText);
        lastError = new Error(`ML API returned status ${res.status}: ${errText}`);
      }
    } catch (err) {
      console.error(`⚠️ [ML Client] Connection failed to ${url}: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to ML API service');
};

module.exports = { predictPerformance };
