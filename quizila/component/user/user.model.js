module.exports = (sequelize, Sequelize, DataTypes) => {
    const User = sequelize.define(
      "qz_user", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        mobile: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        user_type: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue:'user'
        },
        user_pic: {
          type: DataTypes.STRING
        },
        user_name: {
          type: DataTypes.STRING
        },
        user_dob: {
          type: DataTypes.STRING
        },
        code: {
          type: DataTypes.INTEGER
        },
        user_pan: {
          type: DataTypes.STRING
        },
        role: {
          type: DataTypes.STRING
        },
        secret: {
          type: DataTypes.STRING
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue:true
        },
        group: {
          type: DataTypes.STRING
        }
      },
      {
        // Options
        timestamps: true,
        underscrored: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
      }
    );
  
    return User;
};