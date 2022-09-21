const { posts, posts_categories, categories } = require('../utils/initTables');
const UserClass = require('../models/UserSeq');

const User = new UserClass();

exports.getAllCategories = async (req, res) => {
    try {
        const result = await User.findAll(categories);
        return res.json(result);
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened');
    }
}

exports.getCategory = async (req, res) => {
    try {
        const result = await User.findOne(categories, { where: { id: +req.params.category_id } });
        if(result === null) {
            return res.send('Such category has not been found');
        }
        return res.json(result);
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened');
    }
}

exports.getPostsCategory = async (req, res) => {
    try {
        let result = await User.findAll(posts_categories, { where: { categoryID: +req.params.category_id }});
        if(!result.length) {
            return res.send('There is no such category or posts associated with this category');
        }
        result = await User.findAll(posts, { where: { id: result.map(el => el.postID) } });
        return res.json(result);
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while showing posts with this category');
    }
}

//ADD CHECK IF THE CATEGORY ALREADY INSIST
exports.createCategory = async (req, res) => {
    if(req.user.role === 'admin') {
        try {
            await User.create(categories, { name: req.body.name });
            return res.send('Category has been successfully created');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while creating a new category');
        }
    }
    else {
        return res.send('You are not allowed to create new categories');
    }
}

exports.editCategory = async (req, res) => {
    if(req.user.role === 'admin') {
        try {
            await User.update(categories, { name: req.body.name }, { where: { id: +req.params.category_id } });
            return res.send('Category has been successfully updated');
        }
        catch(err) {
            console.error(err);
            return req.send('Some error happened while editing the category');
        }
    }
    else {
        return res.send('You are not allowed to edit categories');
    }
}

exports.deleteCategory = async (req, res) => {
    if (req.user.role === 'admin') {
        try {
            await User.delete(categories, { where: { id: +req.params.category_id } });
            return res.send('Category has been successfully deleted');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while deleting category');
        }
    }
    else {
        return res.send('You are not allowed to delete categories');
    }
}