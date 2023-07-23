module.exports = (sequelize, Sequelize, DataTypes,quizMaster,questionMaster) => {
    const QuizQuestionMapper = sequelize.define(
        "qz_quiz_question_map", // Model name
        {
            // Attributes
            question_id: {
                type: DataTypes.UUID,
                references: {
                  model: questionMaster, 
                  key: 'id'
                }
              },
            quiz_id: {
                type: DataTypes.UUID,
                references: {
                  model: quizMaster,
                  key: 'id'
                }
            },
            question_time: {
                type: DataTypes.STRING
            },

        },
        {
            // Options
            timestamps: true,
            underscrored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return QuizQuestionMapper;
};