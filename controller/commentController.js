const { comments, commentsLikes } = require('../utils/initTables');
const UserClass = require('../models/UserSeq');

const User = new UserClass();

exports.getComment = async (req, res) => {
    try {
        const result = await User.findOne(comments, { where: { id: +req.params.comment_id } });
        if(result === null) {
            return res.send('There is no comment with such id');
        }
        return res.json(result);
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while loading the comment');
    }
}

exports.getLikesComment = async (req, res) => {
    try {
        const result = await User.findAll(commentsLikes, { where: { commentID: +req.params.comment_id } });
        if(result === null) {
            return res.send('There is no likes under this comment');
        }
        return res.json(result);
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while loading likes under comment');
    }
}

exports.addCommentLike = async (req, res) => {
    try {
        await User.create(commentsLikes, { authorID: req.user.id,
            commentID: +req.params.comment_id, publishDate:  getCurrentDate(), type: 'like' });
        return res.send('Like was successfully added');
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while adding like');
    }
}

exports.editComment = async (req, res) => {
    let check = await User.findOne(comments, { where: { id: +req.params.comment_id, authorID: req.user.id } });
    if(check !== null || req.user.role == 'admin') {
        try {
            await User.update(comments, { content: req.body.content }, { where: { id: +req.params.comment_id }});
            return res.send('Comment has been successfully updated');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while updating comment');
        }
    }
    else {
        return res.send('There is no such comment or you have no permissions to edit it');
    }
}

exports.deleteComment = async (req, res) => {
    let check = await User.findOne(comments, { where: { id: +req.params.comment_id, authorID: req.user.id } });

    if(check !== null || req.user.role == 'admin') {
        try {
            await User.delete(comments, { where: { authorID: req.user.id, id: +req.params.comment_id } });
            return res.send('Comment has been successfully deleted');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while deleting the comment');
        }
    }
    else {
        return res.send('There is no such comment or you have no permission to delete it');
    }
}

exports.deleteLikeComment = async (req, res) => {
    let check = await User.findOne(commentsLikes, { where: { commentID: +req.params.comment_id, authorID: req.user.id } });

    if(check !== null || req.user.role == 'admin') {
        try {
            await User.delete(commentsLikes, { where: { commentID: +req.params.comment_id, authorID: req.user.id } });
            return res.send('Like has been successfully deleted');
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while deleting the comment');
        }
    }
    else {
        return res.send('There is no such like or you have no permission to delete it');
    }
}

function getCurrentDate() {
    return new Date().toISOString().substring(0, 19).replace('T', ' ');
}