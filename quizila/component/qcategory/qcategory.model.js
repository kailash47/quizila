module.exports = (sequelize, Sequelize, DataTypes) => {
    const User = sequelize.define(
      "qz_qcategory", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        catname: {
          type: DataTypes.STRING
        },
        catdesc: {
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