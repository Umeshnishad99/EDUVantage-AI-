try {
  const routes = require('./routes/authRoutes');
  console.log('authRoutes loaded successfully');
} catch (err) {
  console.error('Error loading authRoutes:', err);
}
