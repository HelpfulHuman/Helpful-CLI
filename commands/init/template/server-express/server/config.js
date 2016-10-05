require('dotenv').load({ silent: true });

function env (key, fallback) {
  key = key.toUpperCase();
  return (process.env[key] || fallback || null);
}

module.exports = {
  port: env('PORT', 5000)
};