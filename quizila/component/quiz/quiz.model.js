module.exports = (sequelize, Sequelize, DataTypes) => {
    const Quiz = sequelize.define(
      "qz_quiz", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        quizname: {
          type: DataTypes.STRING
        },
        quiztime: {
          type: DataTypes.STRING
        },
        timeperques: {
            type: DataTypes.BOOLEAN
        },
        instructions: {
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
  
    return Quiz;
};