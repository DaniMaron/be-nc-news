const { getCommentsByArticle, postCommentByArticle, deleteCommentById } = require("../controllers/comments.controller");


const commentsRouter = require("express").Router({ mergeParams: true });

commentsRouter.get("/", getCommentsByArticle);
commentsRouter.post("/", postCommentByArticle);

commentsRouter.delete("/:comment_id", deleteCommentById);


module.exports = commentsRouter;
