const bcrypt = require("bcryptjs");
module.exports = {
  hashPassword: function(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  comparePassword: function(inputPassword, hashPassword) {
    return bcrypt.compareSync(inputPassword, hashPassword);
  }
};
