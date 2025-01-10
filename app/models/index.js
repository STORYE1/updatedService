const config = require("../config/dbConfig");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
    }
);

const db = {};

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Consumer = require("./consumer")(sequelize, Sequelize.DataTypes);
db.Tour = require("./guideModel")(sequelize, Sequelize.DataTypes);
db.Media = require("./mediaModel")(sequelize, Sequelize.DataTypes);
db.Category = require("./category")(sequelize, Sequelize.DataTypes);


db.User.hasMany(db.Tour, {
    foreignKey: "user_id",
    as: "tours",
});
db.Tour.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "user",
});

db.Tour.hasMany(db.Media, {
    foreignKey: "tour_id",
    as: "media",
});
db.Media.belongsTo(db.Tour, {
    foreignKey: "tour_id",
    as: "tour",
});

db.Category.hasMany(db.Tour, {
    foreignKey: "category_id",
    as: "tours",
});

db.Tour.belongsTo(db.Category, {
    foreignKey: "category_id",
    as: "category",
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
