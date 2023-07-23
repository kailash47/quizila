module.exports = (sequelize, Sequelize, DataTypes) => {
    const Option = sequelize.define(
      "qz_option", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        question_id: {
          type: DataTypes.UUID,
        },
        option: {
          type: DataTypes.STRING
        },
        iscorrect: {
            type: DataTypes.BOOLEAN
        },
        desc: {
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
  
    return Option;
};