const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "root", "dhoni@00731", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
