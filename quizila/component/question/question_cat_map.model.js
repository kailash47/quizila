module.exports = (sequelize, Sequelize, DataTypes,questionMaster,catMaster) => {
    const QuestionCategoryMapper = sequelize.define(
        "qz_question_cat_map", // Model name
        {
            // Attributes
            question_id: {
                type: DataTypes.UUID,
                references: {
                  model: questionMaster, 
                  key: 'id'
                }
              },
            cat_id: {
                type: DataTypes.UUID,
                references: {
                  model: catMaster,
                  key: 'id'
                }
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

    return QuestionCategoryMapper;
};