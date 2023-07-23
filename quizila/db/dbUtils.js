const mysql = require('mysql2/promise');
const { Sequelize, DataTypes, Op ,QueryTypes} = require("sequelize");

const sequelize = new Sequelize(process.env.DBNAME,process.env.DBUSER,process.env.DBCODE,
    {
        host: process.env.DBHOST,
        dialect:process.env.DBDIALECT,
        logging:false,
        dialectOptions:{
            connectTimeout: 60000
        }
    }
);
const userModel = require('./../component/user/user.model')(sequelize, Sequelize, DataTypes);
const authModel = require('./../component/auth/auth.model')(sequelize, Sequelize, DataTypes);

const qCategoryModel = require('./../component/qcategory/qcategory.model')(sequelize, Sequelize, DataTypes);
const questionModel = require('./../component/question/question.model')(sequelize, Sequelize, DataTypes);
const optionModel = require('./../component/question/option.model')(sequelize, Sequelize, DataTypes);

const questionCatMapperModel = require('../component/question/question_cat_map.model')(sequelize, Sequelize, DataTypes,questionModel,qCategoryModel);


const quizModel = require('./../component/quiz/quiz.model')(sequelize, Sequelize, DataTypes);
const quizQuestionMapperModel = require('./../component/quiz/quiz_question_map.model')(sequelize, Sequelize, DataTypes,quizModel,questionModel);
const quizUserMapperModel = require('./../component/quiz/quiz_user_map.model')(sequelize, Sequelize, DataTypes,quizModel,userModel);
const quizQuestionUserMapperModel = require('./../component/quiz/quiz_question_user_map.model')(sequelize, Sequelize, DataTypes,quizModel,questionModel,userModel);

let dbUtils = {
    executeQuery: async (query, values) => {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DBHOST,
                user: process.env.DBUSER,
                password: process.env.DBCODE,
                database: process.env.DBNAME
            });

            // query database
            const [rows] = await connection.execute(query, values);
            return rows;

        } catch (error) {
            throw error;
        }
    },
    Op,
    QueryTypes,
    sequelize,
    userModel,
    authModel,
    qCategoryModel,
    questionModel,
    optionModel,
    questionCatMapperModel,
    quizModel,
    quizQuestionMapperModel,
    quizUserMapperModel,
    quizQuestionUserMapperModel
};

// ASSOCIATIONs

userModel.hasMany(authModel,{foreignKey: {name:'user_id',type: DataTypes.UUID}});
authModel.belongsTo(userModel,{ foreignKey: {name:'user_id',type: DataTypes.UUID} });

questionModel.hasMany(optionModel,{foreignKey: {name:'question_id',type: DataTypes.UUID}});
optionModel.belongsTo(questionModel,{ foreignKey: {name:'question_id',type: DataTypes.UUID} });

questionModel.belongsToMany(qCategoryModel, { through: questionCatMapperModel,foreignKey:'question_id' });
qCategoryModel.belongsToMany(questionModel, { through: questionCatMapperModel,foreignKey:'cat_id' });



quizModel.belongsToMany(questionModel, { through: quizQuestionMapperModel,foreignKey:'quiz_id' });
questionModel.belongsToMany(quizModel, { through: quizQuestionMapperModel,foreignKey:'question_id' });

quizModel.belongsToMany(userModel, { through: quizUserMapperModel,foreignKey:'quiz_id' });
userModel.belongsToMany(quizModel, { through: quizUserMapperModel,foreignKey:'user_id' });

quizUserMapperModel.belongsToMany(questionModel, { through: quizQuestionUserMapperModel,foreignKey:'quiz_user_id' });
questionModel.belongsToMany(quizUserMapperModel, { through: quizQuestionUserMapperModel,foreignKey:'question_id' });

quizModel.hasMany(quizUserMapperModel,{foreignKey: {name:'quiz_id',type: DataTypes.UUID}});
quizUserMapperModel.belongsTo(quizModel,{foreignKey: {name:'quiz_id',type: DataTypes.UUID}});

userModel.hasMany(quizUserMapperModel,{foreignKey: {name:'user_id',type: DataTypes.UUID}});
quizUserMapperModel.belongsTo(userModel,{foreignKey: {name:'user_id',type: DataTypes.UUID}});


// sequelize.sync({ force: false,alter:true}).then(()=>console.log('All models were synchronized successfully.'));
module.exports = dbUtils;