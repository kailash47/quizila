module.exports = (sequelize, Sequelize, DataTypes,quizUserMaster,questionMaster) => {
    const QuizQuestionUserMapper = sequelize.define(
        "qz_quiz_question_user_map", // Model name
        {
            // Attributes
            question_id: {
                type: DataTypes.UUID,
                references: {
                  model: questionMaster, 
                  key: 'id'
                }
              },
            quiz_user_id: {
                type: DataTypes.UUID,
                references: {
                  model: quizUserMaster,
                  key: 'id'
                }
            },
            opt: {
                type: DataTypes.UUID
            },
            answer:{
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

    return QuizQuestionUserMapper;
};