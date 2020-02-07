const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

module.exports = (req, res, next) => {
  const token = req.headers.token;
  client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    })
    .then(response => {
      req.payload = response.getPayload();
      next();
    })
    .catch(err =>
      next({
        status: 401,
        message: "Google Sign In Access Denied"
      })
    );
};
