const { Todo } = require("../models");
module.exports = function(req, res, next) {
  Todo.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(response => {
      if (response) {
        if (response.UserId == req.decoded.id) {
          next();
        } else {
          next({
            status: 401,
            message: "You are not an authorized user"
          });
        }
      } else {
        next({
          status: 404,
          message: "Todo not found"
        });
      }
    })
    .catch(err => {
      next(err);
    });
};
