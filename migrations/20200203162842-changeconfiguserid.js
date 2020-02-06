"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.addConstraint("Todos", ["UserId"], {
      type: "foreign key",
      name: "Todos_UserId_fkey",
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "CASCADE"
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.removeConstraint("Todos", "Todos_UserId_fkey");
  }
};
