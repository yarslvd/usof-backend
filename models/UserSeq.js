module.exports = class User {
    async findOne(table, condition) {
        const data = await table.findOne(condition);
        return data;
    }

    async findAll(table, condition) {
        const data = await table.findAll(condition);
        return data;
    }

    async findAndCountAll(table, condition) {
        const data = await table.findAndCountAll(condition);
        return data;
    }

    async create(table, info) {
        await table.create(info);
    }
    
    async update(table, info, condition) {
        await table.update(info, condition);
    }

    async delete(table, condition) {
        await table.destroy(condition);
    }
}