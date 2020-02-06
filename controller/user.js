const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
const client = new OAuth2Client(CLIENT_ID);
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
    const token = req.headers.token;
    let user = {};
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(response => {
        const payload = response.getPayload();
        user.email = payload.email;
        return User.findOne({
          where: {
            email: user.email
          }
        });
      })
      .then(response => {
        if (!response) {
          return User.create({
            email: user.email,
            password: SECRET_PASSWORD
          });
        } else {
          return response;
        }
      })
      .then(result => {
        const payload = {
          id: result.id,
          email: result.email
        };
        const token = generateToken(payload);
        res.status(200).json({
          message: "Succesfully Sign In",
          token
        });
      })
      .catch(err => next(err));
  }
}

module.exports = UserController;
