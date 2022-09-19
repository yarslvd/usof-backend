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
}