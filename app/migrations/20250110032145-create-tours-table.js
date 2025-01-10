'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tours', {
      tour_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tour_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tour_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tour_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      ticket_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      leader_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      leader_profile_pic: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      leader_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tour_days: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      tour_timings: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      cities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      guide_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      guide_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      guide_email_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tours');
  },
};
