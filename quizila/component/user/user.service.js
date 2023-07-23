const {userModel,Op} = require('./../../db/dbUtils');

const {getHash} = require('../../shared/utils');
let userService = {
    addUser: async (body) => {
        try {
            body.secret = await getHash(body.secret);
            const qUser = await userModel.create(body);
            return qUser;
        } catch (error) {
            throw error;
        }
    },
    addBulkUser: async (body) => {
        try {
            let data = [];
            for (let index = 0; index < body.data.length; index++) {
                const element = body.data[index];
                const secret = await getHash(element.secret);
                element.secret = secret;
                data.push(element)
            } 
            if(data.length){
                const qUser = await userModel.bulkCreate(data);
                return qUser;
            } else{
                return [];
            }
            
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (body) => {
        try {
            body.secret = await getHash(body.secret);
            const qUser = await userModel.update(body, { where: { id: body.id } });
            return qUser;
        } catch (error) {
            throw error;
        }
    },
    getUser: async (body) => {
        try {
            const { search, offset, limit,pg } = body;
            let query = {
                offset: Number(offset) || 0,
                limit: Number(limit) || 10,
                attributes: { exclude: ['secret','code'] }
            };
            if (search) {
                query.where = {
                    [Op.or]: [
                        {
                            user_name: {
                                [Op.substring]: search
                            }
                        },
                        {
                            group: {
                                [Op.substring]: search
                            }
                        }
                    ]

                }
            } else if(pg =='false'){
                delete query.offset;
                delete query.limit;
            }
            const qUser = await userModel.findAndCountAll(query);
            return qUser;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (body) => {
        try {
            const {id} = body;
            const qUser = await userModel.destroy({
                where: {
                    id: id
                }
            });
            return qUser;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = userService;