const { Todo } = require("../models");
class TodoController {
  static create(req, res, next) {
    const UserId = req.decoded.id;
    const { title, description, status, due_date } = req.body;
    Todo.create({ UserId, title, description, status, due_date })
      .then(response => {
        res.status(201).json(response);
      })
      .catch(err => {
        next(err);
      });
  }

  static delete(req, res, next) {
    const id = req.params.id;
    Todo.destroy({
      where: {
        id
      }
    })
      .then(response => {
        res.status(204).json();
      })
      .catch(err => {
        next(err);
      });
  }

  static find(req, res, next) {
    Todo.findAll({
      where: {
        UserId: req.decoded.id
      }
    })
      .then(response => res.status(200).json(response))
      .catch(err => next(err));
  }

  static findOne(req, res, next) {
    const todoId = req.params.id;
    Todo.findOne({
      where: {
        id: todoId
      }
    })
      .then(response => {
        if (response) {
          res.status(200).json(response);
        } else {
          next({
            status: 404,
            message: "Todo not found"
          });
        }
      })
      .catch(err => next(err));
  }

  static update(req, res, next) {
    const todoId = req.params.id;
    const { title, description, status, due_date } = req.body;
    Todo.update(
      { title, description, status, due_date },
      { where: { id: todoId }, returning: true }
    )
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => next(err));
  }
}

module.exports = TodoController;
