const { fetchArticleById } = require("../models/articles.model");
const fetchCommentsByArticle = require("../models/comments.model");

function getCommentsByArticle(req, res, next) {
    const comments = fetchCommentsByArticle(req.params.article_id)
    const articles = fetchArticleById(req.params.article_id)
    const promises = [comments, articles]
        Promise.all(promises)
        .then((result) => {
            if (result[0].length === 0) {
                
                res.status(200).send({ msg: 'No comments found' }); 
            }
            else {
                res.status(200).send(result[0]); 

            }
                
    })
    .catch(next);
}

module.exports = getCommentsByArticle;
