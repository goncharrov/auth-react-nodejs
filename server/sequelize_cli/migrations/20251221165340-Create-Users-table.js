import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface) {

    await queryInterface.createTable('auth_users', { 
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },      
      firstName: { type: DataTypes.STRING(100), field: "first_name" },
      lastName: { type: DataTypes.STRING(100), field: "last_name" },
      preferredName: { type: DataTypes.STRING(200), field: "preferred_name" },      
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      phone: { type: DataTypes.STRING, unique: true, allowNull: true },            
      birthday: { type: DataTypes.DATE },
      gender: { type: DataTypes.STRING(10) },
      role: {type: DataTypes.STRING(20), defaultValue: "USER"},
      password: { type: DataTypes.STRING(128), allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" }
    },
    {
      timestamps: false,
      underscored: true
    });

    await queryInterface.createTable('auth_users_verification_code', { 
      // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'auth_users',
                key: 'id'
            },
            field: 'user_id',
            allowNull: false            
        },
        code: {type: DataTypes.STRING(128), allowNull: false},
        expire: { type: DataTypes.DATE, allowNull: false }
    });

  },

  async down (queryInterface) {
    await queryInterface.dropTable('auth_users');
    await queryInterface.dropTable('auth_users_verification_code');
  }
};
