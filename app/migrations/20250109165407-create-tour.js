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
          model: 'users', // Make sure this matches the table name for the `users` table
          key: 'user_id',
        },
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
          model: 'categories', // Make sure this matches the table name for the `categories` table
          key: 'category_id',
        },
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tours');
  }
};
