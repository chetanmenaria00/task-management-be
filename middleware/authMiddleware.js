const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.split(" ");
  if (!token) {
    return res
      .status(401)
      .json({ code: 401, message: "No token, authorization denied" });
  }
  if (token.length === 2) {
    token = token[1];
  } else {
    return res
      .status(401)
      .json({ code: 401, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ code: 401, message: "Internal server error!" });
  }
};

module.exports = { protect };
