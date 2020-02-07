const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

const SECRET_PASSWORD = process.env.SECRET_PASSWORD;

class UserController {
  static signUp(req, res, next) {
    const { email, password } = req.body;
    User.create({ email, password })
      .then(response => {
        const payload = {
          id: response.id,
          email: response.email
        };
        res.status(200).json({ message: "Success create user", payload });
      })
      .catch(err => next(err));
  }
  static signIn(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email
      }
    })
      .then(response => {
        if (response) {
          const checkPassword = comparePassword(password, response.password);
          if (checkPassword) {
            const payload = { id: response.id, email: response.email };
            const token = generateToken(payload);
            res.status(200).json({
              message: "Successfully signIn",
              token
            });
          } else {
            next({
              status: 404,
              message: "Username or password wrong"
            });
          }
        } else {
          next({
            status: 404,
            message: "Username or password wrong"
          });
        }
      })
      .catch(err => {
        next(err);
      });
  }
  static destroy(req, res, next) {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(response => res.status(204).json(response))
      .catch(err => res.status(500).json(err));
  }
  static googleSignIn(req, res, next) {
    const { email } = req.payload;
    User.findOne({
      where: {
        email
      }
    })
      .then(response => {
        if (response) {
          const payload = { id: response.id, email: response.email };
          UserController.getToken(res, payload);
        } else {
          UserController.oauthSignInNewUser(res, response.email);
        }
      })
      .catch(err => next(err));
  }
  static githubSignIn(req, res, next) {
    const email = req.userEmail;
    User.findOne({
      where: {
        email
      }
    })
      .then(response => {
        if (response) {
          const payload = { id: response.id, email: response.email };
          UserController.getToken(res, payload);
        } else {
          UserController.oauthSignInNewUser(res, email);
        }
      })
      .catch(err => next(err));
  }
  static oauthSignInNewUser(res, email) {
    User.create({
      email,
      password: SECRET_PASSWORD
    })
      .then(response => {
        const payload = { id: response.id, email: response.email };
        UserController.getToken(res, payload);
      })
      .catch(err => next(err));
  }
  static getToken(res, payload) {
    const token = generateToken(payload);
    res.status(201).json({ message: "Successfully Sign In", token });
  }
}

module.exports = UserController;
