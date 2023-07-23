const {  Op,qCategoryModel } = require('./../../db/dbUtils');
let qCategoryService = {
    addQCategory: async (body) => {
        try {
            const qCategory = await qCategoryModel.create(body);
            return qCategory;
        } catch (error) {
            throw error;
        }
    },
    updateQCategory: async (body) => {
        try {
            const qCategory = await qCategoryModel.update(body, { where: { id: body.id } });
            return qCategory;
        } catch (error) {
            throw error;
        }
    },
    getQCategory: async (body) => {
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
            const qCategory = await qCategoryModel.findAndCountAll(query);
            return qCategory;
        } catch (error) {
            throw error;
        }
    },
    deleteQCategory: async (body) => {
        try {
            const {id} = body;
            const qCategory = await qCategoryModel.destroy({
                where: {
                    id: id
                }
            });
            return qCategory;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = qCategoryService;