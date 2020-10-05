const { User } = require("../models")
const { generateToken } = require("../helpers/jwt")
const { comparePassword } = require("../helpers/bcrypt")
const { OAuth2Client } = require("google-auth-library")

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const SECRET_PASSWORD = process.env.SECRET_PASSWORD
const client = new OAuth2Client(CLIENT_ID)

class UserController {
  static signUp(req, res, next) {
    const { email, password } = req.body
    User.create({ email, password })
      .then(response => {
        const payload = {
          id: response.id,
          email: response.email
        }
        const token = generateToken(payload)
        res.status(200).json({ message: "Success create user", payload, token })
      })
      .catch(err => next(err))
  }
  static signIn(req, res, next) {
    const { email, password } = req.body
    User.findOne({
      where: {
        email
      }
    })
      .then(response => {
        if (response) {
          const checkPassword = comparePassword(password, response.password)
          if (checkPassword) {
            const payload = { id: response.id, email: response.email }
            const token = generateToken(payload)
            res.status(200).json({
              message: "Successfully signIn",
              token
            })
          } else {
            next({
              status: 404,
              message: "Username or password wrong"
            })
          }
        } else {
          next({
            status: 404,
            message: "Username or password wrong"
          })
        }
      })
      .catch(err => {
        next(err)
      })
  }
  static destroy(req, res, next) {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(response => res.status(204).json(response))
      .catch(err => res.status(500).json(err))
  }

  static githubSignIn(req, res, next) {
    const email = req.userEmail
    User.findOne({
      where: {
        email
      }
    })
      .then(response => {
        if (response) {
          const payload = { id: response.id, email: response.email }
          UserController.getToken(res, payload)
        } else {
          UserController.oauthSignInNewUser(res, email)
        }
      })
      .catch(err => next(err))
  }
  static getToken(res, payload) {
    const token = generateToken(payload)
    res.status(201).json({ message: "Successfully Sign In", token })
  }
  static googleSignIn(req, res, next) {
    console.log("end point google sign in")
    const id_token = req.headers.id_token
    let email
    client
      .verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        const payload = ticket.getPayload()
        email = payload.email
        // check user di table user
        return User.findOne({
          where: {
            email
          }
        })
      })
      .then(user => {
        // kalo user ga ada di bikin , kalo udah ada generate jwt token
        if (!user) {
          return User.create({
            email,
            password: SECRET_PASSWORD
          })
        } else {
          return user
        }
      })
      .then(user => {
        const payload = { id: user.id, email: user.email }
        const jwtToken = generateToken(payload)
        return res.status(200).json({
          token: jwtToken
        })
      })
      .catch(err => {
        return res.status(500).json({
          error: err,
          message: "error"
        })
      })
  }
}

module.exports = UserController
