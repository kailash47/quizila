const {  Op,questionModel,optionModel,questionCatMapperModel,qCategoryModel } = require('./../../db/dbUtils');
let questionService = {
    addQuestion: async (body) => {
        try {
            const question = await questionModel.create(body);
            if(body.cats){
                const cats = body.cats.map((ob)=>{
                     
                    return {question_id:question.id,cat_id:ob}
                })
                const questionMap = await questionCatMapperModel.bulkCreate(cats);
                return {questionMap,question};
            }else{
                return question;
            }
            
        } catch (error) {
            throw error;
        }
    },
    updateQuestion: async (body) => {
        try {
            const question = await questionModel.update(body, { where: { id: body.id } });
            if(body.cats){
                const cats = body.cats.map((ob)=>{
                     
                    return {question_id:body.id,cat_id:ob}
                })
                const delquestionMap = await questionCatMapperModel.destroy({
                    where: {
                        question_id: body.id
                    }
                  });
                const questionMap = await questionCatMapperModel.bulkCreate(cats);
                return {questionMap,question};
            }else{
                return question;
            }
        } catch (error) {
            throw error;
        }
    },
    getQuestion: async (body) => {
        try {
            const { search, offset, limit,pg } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
                include: [
                    { 
                        model: qCategoryModel
                    }
                ]
            };
            if (search) {
                query.where = {
                    question: {
                        [Op.substring]: search
                    }
                }
            } else if(pg =='false'){
                delete query.offset;
                delete query.limit;
            }
            const question = await questionModel.findAndCountAll(query);
            return question;
        } catch (error) {
            throw error;
        }
    },
    deleteQuestion: async (body) => {
        try {
            const {id} = body;
            const question = await questionModel.destroy({
                where: {
                    id: id
                }
            });
            return question;
        } catch (error) {
            throw error;
        }
    },

    addOption: async (body) => {
        try {
            const option = await optionModel.create(body);
            return option;
        } catch (error) {
            throw error;
        }
    },
    updateOption: async (body) => {
        try {
            const option = await optionModel.update(body, { where: { id: body.id } });
            return option;
        } catch (error) {
            throw error;
        }
    },
    getOption: async (body) => {
        try {
            const { search, offset, limit,pg } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
            };
            if (search) {
                query.where = {
                    question_id: {
                        [Op.eq]: search
                    }
                }
            } else if(pg =='false'){
                delete query.offset;
                delete query.limit;
            }
            const option = await optionModel.findAndCountAll(query);
            return option;
        } catch (error) {
            throw error;
        }
    },
    deleteOption: async (body) => {
        try {
            const {id} = body;
            const option = await optionModel.destroy({
                where: {
                    id: id
                }
            });
            return option;
        } catch (error) {
            throw error;
        }
    },

    addQuestionCatMap: async (body) => {
        try {
            const question = await questionCatMapperModel.create(body);
            return question;
        } catch (error) {
            throw error;
        }
    },

    getCatQuestion: async (body) => {
        try {
            const { search, offset, limit,pg,cat } = body;
            const question = await qCategoryModel.findOne({
                where:{id:cat},
                include: [
                    { 
                        model: questionModel,
                        // where:{ user_id:user_id}
                    }
                ]
            });
            return question;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = questionService;