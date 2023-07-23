module.exports = (sequelize, Sequelize, DataTypes) => {
    const Question = sequelize.define(
      "qz_question", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        question: {
          type: DataTypes.TEXT
        },
        qtype: {
          type: DataTypes.STRING
        },
        answer: {
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
  
    return Question;
};