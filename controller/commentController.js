const { comments, commentsLikes, users } = require('../utils/initTables');
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
    let check = await User.findOne(commentsLikes, { where: { authorID: req.user.id, commentID: +req.params.comment_id } });
    if(check !== null) {
        if(check.dataValues.type === 'like' && req.body.type === 'dislike') {
            await User.update(commentsLikes, { type: 'dislike' }, { where: { authorID: req.user.id, commentID: +req.params.comment_id } });
            let comment = await User.findOne(comments, { where: { id: +req.params.comment_id } });
            let user = await User.findOne(users, { where: { id: comment.dataValues.authorID}});
            const { rating } = user.dataValues;

            await User.update(users, { rating: rating - 2 }, { where: { id: user.dataValues.id } });

            return res.send('You have successfully changed like to dislike');
        }
        if(check.dataValues.type === 'dislike' && req.body.type === 'like') {
            await User.update(commentsLikes, { type: 'like' }, { where: { authorID: req.user.id, commentID: +req.params.comment_id } });
            let comment = await User.findOne(comments, { where: { id: +req.params.comment_id } });
            let user = await User.findOne(users, { where: { id: comment.dataValues.authorID}});
            const { rating } = user.dataValues;

            await User.update(users, { rating: rating + 2 }, { where: { id: user.dataValues.id } });

            return res.send('You have successfully changed dislike to like');
        }
        if(check.dataValues.type === 'dislike' && req.body.type === 'dislike' ||
                check.dataValues.type === 'like' && req.body.type === 'like') {
            return res.send('You have already liked/disliked this post');
        }
    }

    try {
        if(req.body.type === 'like') {
            await User.create(commentsLikes, { authorID: req.user.id,
                commentID: +req.params.comment_id, publishDate:  getCurrentDate(), type: 'like' });
    
            let comment = await User.findOne(comments, { where: { id: +req.params.comment_id } });
            let user = await User.findOne(users, { where: { id: comment.dataValues.authorID}});
            const { rating } = user.dataValues;
            await User.update(users, { rating: rating + 1 }, { where: { id: user.dataValues.id } });
    
            return res.send('Like was successfully added');
        }
        if(req.body.type === 'dislike') {
            await User.create(commentsLikes, { authorID: req.user.id,
                commentID: +req.params.comment_id, publishDate:  getCurrentDate(), type: 'dislike' });
    
            let comment = await User.findOne(comments, { where: { id: +req.params.comment_id } });
            let user = await User.findOne(users, { where: { id: comment.dataValues.authorID}});
            const { rating } = user.dataValues;
            await User.update(users, { rating: rating - 1 }, { where: { id: user.dataValues.id } });
    
            return res.send('Dislike was successfully added');
        }
    }
    catch(err) {
        console.error(err);
        return res.send('Some error happened while adding like');
    }

    return res.send('Please provide like/dislike in JSON');
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

    if(check != null || req.user.role == 'admin') {
        try {
            if(await User.findOne(commentsLikes, { where: { commentID: +req.params.comment_id, authorID: req.user.id } }) == null) {
                return res.send('There is no like on that comment');
            }
            if(check.dataValues.type === 'like') {
                await User.delete(commentsLikes, { where: { commentID: +req.params.comment_id, authorID: req.user.id } });

                let comment = await User.findOne(comments, { where: { id: +req.params.comment_id } });
                let user = await User.findOne(users, { where: { id: comment.dataValues.authorID}});
                const { rating } = user.dataValues;
                await User.update(users, { rating: rating - 1 }, { where: { id: user.dataValues.id } });

                return res.send('Like has been successfully deleted');
            }
            if(check.dataValues.type === 'dislike') {
                await User.delete(commentsLikes, { where: { commentID: +req.params.comment_id, authorID: req.user.id } });

                let comment = await User.findOne(comments, { where: { id: +req.params.comment_id } });
                let user = await User.findOne(users, { where: { id: comment.dataValues.authorID}});
                const { rating } = user.dataValues;
                await User.update(users, { rating: rating + 1 }, { where: { id: user.dataValues.id } });

                return res.send('Dislike has been successfully deleted');
            }
        }
        catch(err) {
            console.error(err);
            return res.send('Some error happened while deleting the comment like');
        }
    }
    else {
        return res.send('There is no such like or you have no permission to delete it');
    }
}

function getCurrentDate() {
    return new Date().toISOString().substring(0, 19).replace('T', ' ');
}