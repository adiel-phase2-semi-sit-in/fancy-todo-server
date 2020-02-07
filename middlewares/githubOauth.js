const { getAccessToken, getUserData } = require("../helpers/githubRequest");
const GITHUB_AUTHORIZE_ERROR = {
  status: 401,
  message: "Github Sign In Access Denied"
};
module.exports = {
  getAccessToken: (req, res, next) => {
    getAccessToken(req.headers.code)
      .then(response => {
        req.access_token = response;
        next();
      })
      .catch(err => next(GITHUB_AUTHORIZE_ERROR));
  },
  getUserData: (req, res, next) => {
    getUserData(req.access_token)
      .then(response => {
        req.userEmail = response;
        next();
      })
      .catch(err => next(GITHUB_AUTHORIZE_ERROR));
  }
};
