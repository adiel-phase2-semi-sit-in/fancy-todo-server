"use strict";
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model;
  class Todo extends Model {}
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1],
            msg: "Title at least have 1 characters"
          },
          notNull: {
            args: true,
            msg: "Title should not be empty"
          }
        }
      },
      UserId: {
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [1],
            msg: "description at least have 1 characters"
          },
          notNull: {
            args: true,
            msg: "description should not be empty"
          }
        }
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter: {
            args: new Date().toString(),
            msg: "Due date cannot be less than current date"
          },
          notNull: {
            args: true,
            msg: "due_date should not be empty"
          },
          isDate: {
            args: true,
            msg: "invalid date format"
          }
        }
      }
    },
    { sequelize }
  );
  Todo.associate = function(models) {
    // associations can be defined here
    Todo.belongsTo(models.User);
  };
  return Todo;
};
