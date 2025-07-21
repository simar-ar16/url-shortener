function restrictToAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).send("Access denied: Admins only.");
}

module.exports = restrictToAdmin;
