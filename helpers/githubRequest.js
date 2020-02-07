const axios = require("./axios");
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: "https://github.com/login/oauth/access_token",
      data: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_SECRET,
        code
      },
      headers: {
        Accept: "application/json"
      }
    })
      .then(({ data }) => {
        resolve(data.access_token);
      })
      .catch(err => reject(err));
  });
}

function getUserData(access_token) {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: "https://api.github.com/user",
      headers: {
        Authorization: "token " + access_token
      }
    })
      .then(({ data }) => {
        resolve(data.email);
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  getAccessToken: getAccessToken,
  getUserData: getUserData
};
