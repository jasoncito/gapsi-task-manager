function errorHandler(err, req, res, next) {
  const status = err.response?.status || 500;
  // Only forward messages that came from the upstream Go service; never expose
  // internal Node/axios error strings (e.g. "connect ECONNREFUSED …") to callers.
  const message = err.response?.data?.error || 'Internal server error';
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
