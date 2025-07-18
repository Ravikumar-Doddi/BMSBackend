const jwt = require("jsonwebtoken");
module.exports = function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized access",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded.id);
    if (!req.body) req.body = {};
    req.body.id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Invalid token",
      success: false,
    });
  }
};
