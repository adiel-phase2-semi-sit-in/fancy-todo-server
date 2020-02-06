"use strict";
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;

  class User extends Model {}
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email format is not correct"
          },
          notNull: {
            args: true,
            msg: "Email should not be empty"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6],
            msg: "Password at least have 6 characters"
          },
          notNull: {
            args: true,
            msg: "Password should not be empty"
          }
        }
      }
    },
    {
      hooks: {
        beforeCreate: function(user, options) {
          const hash = hashPassword(user.password);
          user.password = hash;
        }
      },
      sequelize
    }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Todo, {
      onDelete: "CASCADE"
    });
  };
  return User;
};
