/*
The purpose of this file is to bundle together the entities (such as users or posts) to be accessed through this single interface so we do not need to import each entity seperately when using the database in general.

These functions will primarily be accessed through the User endpoints which act as the main point of connection between the front-end and back-end.

All such API endpoints (routes), along with example usages and expected return values, are available in the routes folder and will be clearly documented on Postman.
*/

const login = require("./entities/users.js").login;
const signup = require("./entities/users.js").signup;
const addPost = require("./entities/posts.js").addPost;
const editPost = require("./entities/posts.js").editPost;
const deletePost = require("./entities/posts.js").deletePost;
const searchPosts = require("./entities/posts.js").searchPosts;
const getUserPosts = require("./entities/posts.js").getUserPosts;
const searchMyPosts = require("./entities/posts.js").searchMyPosts
const setUserAddress = require("./entities/users.js").setUserAddress;
const getUserByUserid = require("./entities/users.js").getUserByUserid;
const getPostByPostID = require("./entities/posts.js").getPostByPostID;
const checkUserAddress = require("./entities/users.js").checkUserAddress;
const getEmailByUserid = require("./entities/users.js").getEmailByUserid;
const checkUsernameExists= require("./entities/users.js").checkUsernameExists;
const generateLatestPosts = require("./entities/posts.js").generateLatestPosts;



module.exports.login = login;
module.exports.signup = signup;
module.exports.addPost = addPost;
module.exports.editPost = editPost;
module.exports.deletePost = deletePost;
module.exports.searchPosts = searchPosts;
module.exports.getUserPosts = getUserPosts;
module.exports.searchMyPosts = searchMyPosts;
module.exports.setUserAddress = setUserAddress;
module.exports.getUserByUserid = getUserByUserid;
module.exports.getPostByPostID = getPostByPostID;
module.exports.getEmailByUserid = getEmailByUserid;
module.exports.checkUserAddress = checkUserAddress;
module.exports.checkUsernameExists = checkUsernameExists;
module.exports.generateLatestPosts = generateLatestPosts;


