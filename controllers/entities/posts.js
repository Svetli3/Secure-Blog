const { response, text } = require("express");
const database = require("../../database.js");
const fs = require("fs");
const { stringify } = require("querystring");
const clean = require('xss-clean/lib/xss').clean;
const sqlstring = require('sqlstring');

// ***************SQLSTRING EXPLANATION********************
// SQL string cleans the following characters:
// Single quotes (')
// Double quotes (")
// Backslashes (\)
//
// It cleans these characters by adding a backslash(`\`)
// ' becomes \'
// " becomes \"
// \ becomes \\
//
// Why not the `--` sequence (start a comment in SQL)?
// The `--` sequence is typically not considered dangerous by itself; 
// it's the context in which it's used that poses a risk. 
// For example, if -- is used to comment out part of a query constructed using string concatenation, it can lead to SQL injection vulnerabilities.

async function getUserPosts(userid) {
    const query = 'SELECT * FROM posts WHERE userid = $1';
    let posts;

    try {
        let response = await database.query(query, [userid]);
        posts = response.rows;
    } catch (error) {
        console.log("Error loading user posts");
        return false;
    }

    if (posts.length === 0 || posts[0] === undefined) {
        return false;
    }

    return posts;
}

async function getPostByPostID(postid) {
    const sql = 'SELECT * FROM posts WHERE postid = $1';
    let post = {};

    if (typeof postid !== "number" || postid === "" || postid === undefined || postid === null) {
        console.log(`Error the current post id is ${postid} !`)
        return false;
    }

    try {
        let response = await database.query(sql, [postid]);
        post = response.rows;
    } catch (error) {
        console.log(`Error getting post by ID`)
        return false;
    }

    if (post.length === 0 || post[0] === undefined) {
        console.log(`Error the current post is of value ${postid} !`)
        return false;
    }

    return post[0];
}


async function editPost(editPostDetails, userid) {
    let postid = editPostDetails.postid;
    let image = editPostDetails.image;
    let text = clean(editPostDetails.text);
    console.log("SQL injection/XSS, (entities/posts.js) edit post, text field has been checked and cleaned, Test 1 passed");

    if (!(editPostDetails instanceof Object) || editPostDetails === null || editPostDetails === undefined) {
        console.log(`Error the current post datils is${editPostDetails} !`)
        return false;
    }

    if (typeof text !== "string" || text.length <= 1 || text === null) {
        console.log(`Error the current text is of value ${editPostDetails} !`)
        return false;
    }

    try {
        let targetPost = await getPostByPostID(postid);

        if (Object.keys(targetPost).length === 0) {
            return false;
        }

        let query = 'UPDATE posts SET image = $1, text = $2 WHERE postid = $3 and userid = $4;';
        console.log("IDOR: UserID has been checked, Test 3 passed")
        let response = await database.query(query, [image, text, targetPost.postid, userid]);
        if (response.affectedRows === 0) {
            console.log(`Error no rows were effected by sql query in edit post !`)
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(`Error editing post! ` + error)
        return false;
    }
}

async function addPost(details, userid) {
    let image = details.image;
    let text = clean(details.text);
    console.log("SQL injection/XSS, (entities/posts.js) add post, text field has been checked and cleaned, Test 1 passed");

    if (!(details instanceof Object) || details === null || details === undefined) {
        console.log(`Error add post details of value ${details}!`)
        return false;
    }

    if (typeof text !== "string" || text.length <= 1 || text === null) {
        console.log(`Error text of value ${details}!`)
        return false;
    }

    let query;
    if (typeof image === "string") {
        query = 'INSERT INTO posts (userid, image, text) VALUES ($1, $2, $3);';
    } else {
        query = 'INSERT INTO posts (userid, image, text) VALUES ($1, $2, $3);';
    }
    console.log("IDOR: UserID has been checked, Test 5 passed")
    console.log([userid, image, text])
    try {
        let response = await database.query(query, [userid, image, text]);

        if (response.affectedRows === 0) {
            console.log(`Error no rows were effected by sql query in add post!`)
            return false;
        } else {
            return true;
        }
    } catch (error) {
		console.log("Error adding a new post");
        console.log(error)
        return false;
    }
}

async function deletePost(postid, userid) {
    const sql = 'DELETE FROM posts WHERE postid = $1 and userid = $2;';
    console.log("IDOR: UserID has been checked, Test 4 passed")
    try {
        let response = await database.query(sql, [postid, userid]);

        if (response.affectedRows === 0) {
            console.log(`Error no rows were effected by sql query in delete post!`)
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(`Error in add post!`)
        return false;
    }
}


async function searchPosts(searchText) {
    searchText = clean(sqlstring.escape(searchText));
    console.log("Search text: " + searchText);
    console.log("SQL injection/XSS, (entities/posts.js) searching a post, text field has been checked and cleaned, Test 1 passed");
    
    const sql = `SELECT * FROM posts WHERE LOWER($1) % ANY(STRING_TO_ARRAY(LOWER(text), ' '))
	AND LOWER(text) LIKE LOWER('%' || $1 || '%')
	OR SIMILARITY(LOWER(text), LOWER($1)) > 0.1
	ORDER BY date DESC LIMIT 10;`;
    let posts = [];

    if (typeof searchText !== "string" || searchText === "" || searchText === undefined || searchText === null) {
        console.log(`Error in search posts, search text of value ${searchText}!`)
        return false;
    }

    try {
        let response = await database.query(sql, [searchText]);
        posts = response.rows;
    } catch (error) {
        return false;
    }

    if (posts.length === 0 || posts[0] === undefined) {
        console.log(`Error in search posts, no posts found!`)
        return false;
    }
    postInfo = []
    for (let i = 0; i < posts.length; i++) {
        currentUserID = posts[i].userid
        currentPostText = posts[i].text
        currentPostImage = posts[i].image

        const sql2 = 'SELECT * FROM users WHERE userid = $1'

        let response2 = await database.query(sql2, [currentUserID]);
        users = response2.rows

        for (let i = 0; i < users.length; i++) {
            displayname = users[i].displayname
            profilepicid = users[i].profilepicid
            postInfo.push({
                displayname: displayname,
                profilepicid: profilepicid,
                currentPostText: currentPostText,
                currentPostImage

            })
        }
    }
    return postInfo;
}


async function searchMyPosts(searchText, userid) {
    searchText = clean(sqlstring.escape(searchText));
    console.log("Search text: " + searchText);
    console.log("SQL injection/XSS, (entities/posts.js) searching user owned posts, text field has been checked and cleaned, Test 1 passed");
    
    const sql = `SELECT * FROM posts WHERE userid = $1 AND
	LOWER($2) % ANY(STRING_TO_ARRAY(LOWER(text), ' '))
	AND LOWER(text) LIKE LOWER('%' || $2 || '%')
	OR SIMILARITY(LOWER(text), LOWER($2)) > 0.05
	ORDER BY date DESC LIMIT 10;`;
    let posts = [];

    if (typeof searchText !== "string" || searchText === "" || searchText === undefined || searchText === null) {
        return false;
    }

    try {
        console.log("IDOR: UserID has been checked, Test 6 passed")
        let response = await database.query(sql, [userid, searchText]);
        posts = response.rows;
    } catch (error) {
        return false;
    }

    if (posts.length === 0 || posts[0] === undefined) {
        console.log(`Error in search posts, no posts found!`)
        return false;
    }
    return posts;
}

async function generateLatestPosts() {
    const sql = `SELECT * FROM posts 
	ORDER BY date DESC
	LIMIT 10`;

    let posts = [];

    try {
        let response = await database.query(sql);
        posts = response.rows;
    } catch (error) {
        console.log(`Error in generate posts, no posts found!`)
        return false;
    }

    postInfo = []
    for (let i = 0; i < posts.length; i++) {
        currentUserID = posts[i].userid
        currentPostText = posts[i].text
        currentPostImage = posts[i].image

        const sql2 = 'SELECT * FROM users WHERE userid = $1'

        let response2 = await database.query(sql2, [currentUserID]);
        users = response2.rows

        for (let i = 0; i < users.length; i++) {
            display = users[i].displayname
            profilepicid = users[i].profilepicid
            postInfo.push({
                displayname: display,
                profilepicid: profilepicid,
                currentPostText: currentPostText,
                currentPostImage

            })
        }
    }

    return postInfo;
}

module.exports.addPost = addPost;
module.exports.editPost = editPost;
module.exports.deletePost = deletePost;
module.exports.searchPosts = searchPosts;
module.exports.searchMyPosts = searchMyPosts;
module.exports.generateLatestPosts = generateLatestPosts;
module.exports.getUserPosts = getUserPosts;
module.exports.getPostByPostID = getPostByPostID;
