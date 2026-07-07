function requireAuth(req, _res, next) {
  req.user = {
    id: req.user?.id || 'demo-user',
    name: req.user?.name || req.body?.candidateName || 'Candidate',
    email: req.user?.email || req.body?.candidateEmail || '',
    phone: req.user?.phone || req.body?.candidatePhone || '',
  };
  next();
}

module.exports = { requireAuth };
