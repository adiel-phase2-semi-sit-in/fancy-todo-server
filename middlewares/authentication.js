const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");
module.exports = function(req, res, next) {
  try {
    const decoded = verifyToken(req.headers.token);
    User.findOne({
      where: {
        id: decoded.id
      }
    }).then(response => {
      if (response) {
        req.decoded = decoded;
        next();
      } else {
        next({
          status: 401,
          message: "User not registered"
        });
      }
    });
  } catch (err) {
    next(err);
  }
};
