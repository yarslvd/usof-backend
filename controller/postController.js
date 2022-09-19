const { posts, comments, users, posts_categories, categories, postsLikes } = require('../utils/initTables');
const UserClass = require('../models/UserSeq');
const { parseJwt } = require('../utils/jwt');

const User = new UserClass();

exports.getAllPosts = (req, res) => {
    const { page } = req.query;
    const size = 2;
    const { limit, offset } = getPagination(page, size);
    
    User.findAndCountAll(posts, {where: { status: true }, limit, offset})
        .then(data => {
            const response = getPagingData(data, page, limit);
            return res.send(response);
        })
        .catch(err => {
            return res.sendStatus(500).send('Some error occured while receiving posts');
        });
}

exports.getPost = async (req, res) => {
    const result = await User.findOne(posts, { where: { id: +req.params.post_id } });
    if(result === null) {
        return res.send('Post has not been found');
    }
    return res.json(result);
}

exports.getComments = async (req, res) => {
    const post = await User.findOne(posts, { where: { id: +req.params.post_id } });
    console.log(post);
    if(post === null) {
        return res.send('Such post has not been found');
    }

    const result = await User.findAll(comments, { where: { postID: +req.params.post_id } });
    if(!result.length) {
        return res.send('There is no comments. Be first to comment!');
    }

    return res.json(result.map(el => el.dataValues));
}

exports.addComment = async (req, res) => {
    let obj = parseJwt(req.cookies.token);
    const user = await User.findOne(users, { where: { id: obj.id } });
    const date = new Date().toISOString().substring(0, 19).replace('T', ' ');

    try {
        await comments.create({ authorID: user.dataValues.id, postID: req.params.post_id, publishDate: date, content: req.body.content});
        return res.send('Comment has been successfully added');
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened during posting this comment. Try again!');
    }
}

exports.getCategories = async (req, res) => {
    try {
        let result = await User.findOne(posts_categories, { where: { postID: req.params.post_id }});
        result = await User.findAll(categories, { where: { id:result.categoryID } });
        return res.json(result.map(el => el.name));
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while loading post categories');
    }
}

exports.getLikes = async (req, res) => {
    try {
        //let result = await User.findAll(postsLikes, { where: { } })
    }
    catch(err) {
        console.error(err);
    }
}





const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: posts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, posts, totalPages, currentPage };
};

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};