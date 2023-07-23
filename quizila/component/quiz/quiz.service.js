const {  Op,quizModel,quizQuestionMapperModel,quizUserMapperModel,quizQuestionUserMapperModel,questionModel,optionModel,qCategoryModel,userModel } = require('./../../db/dbUtils');
let quizService = {
    addQuiz: async (body) => {
        try {
            const quiz = await quizModel.create(body);
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    updateQuiz: async (body) => {
        try {
            const quiz = await quizModel.update(body, { where: { id: body.id } });
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    getQuiz: async (body) => {
        try {
            const { search, offset, limit,pg } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            if (search) {
                query.where = {
                    catname: {
                        [Op.substring]: search
                    }
                }
            } else if(pg =='false'){
                delete query.offset;
                delete query.limit;
            }
            const quiz = await quizModel.findAndCountAll(query);
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    deleteQuiz: async (body) => {
        try {
            const {id} = body;
            const quiz = await quizModel.destroy({
                where: {
                    id: id
                }
            });
            return quiz;
        } catch (error) {
            throw error;
        }
    },

    addQuizQuestionMap: async (body) => {
        try {
            const quizQuestionMap = await quizQuestionMapperModel.bulkCreate(body.data);
            return quizQuestionMap;
        } catch (error) {
            throw error;
        }
    },
    getQuizQuestionMap: async (body) => {
        try {
            const { search, offset, limit, pg,quiz_id } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            if (search) {
                query.where = {
                    catname: {
                        [Op.substring]: search
                    }
                }
            } else if (pg == 'false') {
                delete query.offset;
                delete query.limit;
            }
            const quiz = await quizModel.findOne(
                {
                    where:{ id:quiz_id},
                    include: [
                        { 
                            model: questionModel,
                            // where:{ user_id:user_id}
                        }
                    ]
                }
            );
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    deleteQuizQuestionMap: async (body) => {
        try {
            const {question_id,quiz_id} = body;
            const quiz = await quizQuestionMapperModel.destroy({
                where: {
                    question_id: question_id,
                    quiz_id: quiz_id
                }
            });
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    
    addQuizUserMap: async (body) => {
        try {
            const quizUserMap = await quizUserMapperModel.bulkCreate(body.data);
            return quizUserMap;
        } catch (error) {
            throw error;
        }
    },
    getQuizUserMap: async (body) => {
        try {
            const { search, offset, limit, pg,quiz_id } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            if (search) {
                query.where = {
                    catname: {
                        [Op.substring]: search
                    }
                }
            } else if (pg == 'false') {
                delete query.offset;
                delete query.limit;
            }
            const quiz = await quizModel.findOne(
                {
                    where:{ id:quiz_id},
                    include: [
                        { 
                            model: userModel,
                            attributes: { exclude: ['secret','code'] }
                            // where:{ user_id:user_id}
                        }
                    ]
                }
            );
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    deleteQuizUserMap: async (body) => {
        try {
            const {id} = body;
            const quiz = await quizUserMapperModel.destroy({
                where: {
                    id: id
                }
            });
            return quiz;
        } catch (error) {
            throw error;
        }
    },
    updateQuizUserMap: async (body) => {
        try {
            const quiz = await quizUserMapperModel.update(body, { where: { id: body.id } });
            return quiz;
        } catch (error) {
            throw error;
        }
    },


    addQuizQuestionUserMap: async (body) => {
        try {
            const data = {endtime : new Date(), status:'COMPLETED'};
            const quizQuestionUserMap = await quizQuestionUserMapperModel.bulkCreate(body.data);
            await quizUserMapperModel.update(data, { where: { id: body.quiz_user_id } });
            return quizQuestionUserMap;
        } catch (error) {
            throw error;
        }
    },
    getMyQuiz: async (body) => {
        try {
            const { search, offset, limit,pg,user_id } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            
            const data = await quizUserMapperModel.findAll(
                {
                    where:{ user_id: user_id, status:'ACTIVE'},
                    include: [
                        { 
                            model: quizModel,
                            attributes:{ exclude: ['qz_quiz_question_map'] },
                            include:[
                                {
                                    model: questionModel,
                                    attributes:{ exclude: ['answer','qz_quiz_question_map'] },
                                    include:[
                                        { 
                                            model: qCategoryModel,
                                            attributes: ['catname']
                                        },
                                        {
                                            model: optionModel,
                                            attributes: ['id','option']
                                        }
                                    ]
                                }
                            ]
                        },
                        // { 
                        //     model: questionModel,
                        //     include:[qCategoryModel,optionModel]
                        // }
                    ]
                }
            );
            return data;
            // if (search) {
            //     query.where = {
            //         catname: {
            //             [Op.substring]: search
            //         }
            //     }
            // } else if(pg =='false'){
            //     delete query.offset;
            //     delete query.limit;
            // }
            // const quiz = await quizModel.findAndCountAll(query);
            // return quiz;
        } catch (error) {
            throw error;
        }
    },
    getMyQuizList: async (body) => {
        try {
            const { search, offset, limit,pg,user_id } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            const data = await quizModel.findAll(
                {
                    // where:{ user_id:user_id},
                    include: [
                        { 
                            model: quizUserMapperModel,
                            // where:{ user_id:user_id}
                        }
                    ]
                }
            );
            return data;
            // if (search) {
            //     query.where = {
            //         catname: {
            //             [Op.substring]: search
            //         }
            //     }
            // } else if(pg =='false'){
            //     delete query.offset;
            //     delete query.limit;
            // }
            // const quiz = await quizModel.findAndCountAll(query);
            // return quiz;
        } catch (error) {
            throw error;
        }
    },
    getLeaderboard: async (body) => {
        try {
            const { search, offset, limit,pg,quiz_id } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            
            const data = await quizUserMapperModel.findAll(
                {
                    where:{ quiz_id: quiz_id},
                    include: [
                        { 
                            model: questionModel,
                            include:[qCategoryModel,optionModel]
                            // include:[
                            //     {
                            //         model: questionModel,
                            //         include:[qCategoryModel,optionModel]
                            //     }
                            // ]
                        },
                        { 
                            model: userModel,
                            attributes: { exclude: ['secret','code'] }
                            // include:[qCategoryModel,optionModel]
                        }
                    ]
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = quizService;