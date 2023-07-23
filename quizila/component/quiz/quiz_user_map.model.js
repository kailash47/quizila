module.exports = (sequelize, Sequelize, DataTypes,quizMaster,userMaster) => {
    const QuizUserMapper = sequelize.define(
        "qz_quiz_user_map", // Model name
        {
            // Attributes
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
              },
            quiz_id: {
                type: DataTypes.UUID,
                references: {
                  model: quizMaster, 
                  key: 'id'
                }
              },
            user_id: {
                type: DataTypes.UUID,
                references: {
                  model: userMaster,
                  key: 'id'
                }
            },
            expiry: {
                type: DataTypes.DATE
            },
            starttime: {
                type: DataTypes.DATE
            },
            endtime: {
                type: DataTypes.DATE
            },
            remarks:{
                type: DataTypes.STRING
            },
            status: {
                type: DataTypes.STRING,
                defaultValue:"ACTIVE"
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

    return QuizUserMapper;
};