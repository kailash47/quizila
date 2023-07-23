module.exports = (sequelize, Sequelize, DataTypes) => {
    const Auth = sequelize.define(
      "qz_auth", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false
        },
        access_token: {
          type: DataTypes.TEXT
        },
        refresh_token: {
          type: DataTypes.TEXT
        },
        device_id: {
          type: DataTypes.STRING
        },
        expiry: {
          type: DataTypes.STRING,
          allowNull: false
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
  
    return Auth;
};