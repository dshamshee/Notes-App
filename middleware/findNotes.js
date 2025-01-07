const notesModel = require('../models/notes');


module.exports = async function(req, res, next){
    let AllPosts = await notesModel.find({userID: req.user._id});
    req.posts = AllPosts;
    next();
}