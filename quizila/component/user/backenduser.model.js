module.exports = (sequelize, Sequelize, DataTypes) => {
    const BackendUser = sequelize.define(
      "sb_backenduser", // Model name
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
        },
        role: {
          type: DataTypes.STRING
        },
        full_name: {
          type: DataTypes.STRING
        },
        code: {
          type: DataTypes.STRING
        },
        access_token: {
          type: DataTypes.TEXT
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
  
    return BackendUser;
};