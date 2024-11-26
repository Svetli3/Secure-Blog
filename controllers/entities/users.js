const database = require("../../database.js");
const encrypt = require('../encryption.js');
const clean = require('xss-clean/lib/xss').clean;

usernameEncryption = "$2b$12$U/g13Q99iHRFd2GLvllC4u"

async function getUserByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = $1';
    let user = {};

    let cleaned_username = username
    const hashed_username = encrypt.hashPassword(cleaned_username,usernameEncryption);


    if (typeof username !== "string" || username === "" || username === undefined || username === null) {
        return false;
    }

    try {
        let response = await database.query(sql, [hashed_username]);
        user = response.rows;
    } catch (error) {
        return false;
    }

    if (user.length === 0 || user[0] === undefined) {
        return false;
    }

    return user[0];
}

async function getUserByUserid(userid) {
    const sql = 'SELECT * FROM users WHERE userid = $1';
    let user = {};

    if (typeof userid !== "number" || userid === "" || userid === undefined || userid === null) {
        return false;
    }

    try {
        let response = await database.query(sql, [userid]);
        user = response.rows;
    } catch (error) {
        return false;
    }

    if (user.length === 0 || user[0] === undefined) {
        return false;
    }

    return user[0];
}

async function checkUsernameExists(username){
    const sql = 'SELECT * FROM users WHERE username = $1';
    let user = {};

    let cleaned_username = clean(username)
    const encrypted_username = encrypt.hashPassword(cleaned_username,usernameEncryption);

    if (typeof username !== "string" || username === "" || username === undefined || username === null) {
        return false;
    }

    try {
        let response = await database.query(sql, [encrypted_username]);
        user = response.rows;
    } catch (error) {
        return false;
    }

    if (user.length === 0 || user[0] === undefined) {
        return false;
    }

    return true;
}

async function getEmailByUserid(userid){
    const sql = 'SELECT * FROM users WHERE userid = $1';
    let user = {};

    if (typeof userid !== "number" || userid === "" || userid === undefined || userid === null) {
        return false;
    }

    try {
        let response = await database.query(sql, [userid]);
        user = response.rows;
        var decrypted_email = encrypt.decrypt(user[0].email,user[0].salt);
    } catch (error) {
        return false;
    }

    if (user.length === 0 || user[0] === undefined) {
        return false;
    }
    
    return decrypted_email
}

async function login(userDetails) {
    let username = clean(userDetails.username);
    let password = userDetails.password;

    if (!(userDetails instanceof Object) || userDetails === null || userDetails === undefined) {
        return false;
    }

    if (typeof username !== "string" || username.length <= 1 || typeof password !== "string" || password.length <= 1) {
        return false;
    }

    let keys = Object.keys(userDetails);

    keys.forEach(key => {
        if (key === null || key === undefined) {
            return false;
        }
    });

    try {
        let targetUser = await getUserByUsername(username);

        if (Object.keys(targetUser).length === 0) {
            return false;
        }

        if (await encrypt.isMatch(encrypt.pepper(password), targetUser.password, targetUser.salt) === true) {
            return {userid: targetUser.userid, profilepicid: targetUser.profilepicid};
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

async function signup(user, address) {
    
    if (!(user instanceof Object) || user === null || user === undefined) {
        console.log("a")
        return false;
    }

    let keys = Object.keys(user);

    keys.forEach(key => {
        if (key === null || key === undefined) {
            console.log("b")
            return false;
        }
    });

    try {
        console.log("c")
        const randomDelay = Math.random() * (2000 - 500) + 500;
        // await new Promise(r => setTimeout(r, randomDelay));
        cleaned_displayname = clean(user.displayname);
		cleaned_username = user.username;

        const salt = encrypt.generateSalt();
        const hashed_password = encrypt.hashPassword(encrypt.pepper(user.password), salt);
        const hashed_username = encrypt.hashPassword(cleaned_username,usernameEncryption);
        
        

        const encrypted_email = encrypt.encrypt(user.email,salt);
    
		const sql = 'INSERT INTO users (displayname, username, email, password, salt) VALUES ($1, $2, $3, $4, $5)';
        let response = await database.query(sql, [cleaned_displayname, hashed_username, encrypted_email, hashed_password, salt]);

        if (response.affectedRows === 0) {
            console.log("d")
            return false;
        }
      
        let targetUser = await getUserByUsername(cleaned_username);
        await setUserAddress(targetUser.userid, address);

        return {userid: targetUser.userid, profilepicid: targetUser.profilepicid};
    } catch (error) {
        console.log(error)
        return false;
    }
}

async function setUserAddress(userid, address)
{
    if (userid === null || userid === undefined) {
        console.log(`Session Hijacking (entities/users.js), setting User Address: userid is ${userid}, Test 1 failed`);
        return false;
    }
    console.log(`Session Hijacking (entities/users.js), setting User Address: userid is defined, Test 1 passed`);

    if (typeof address !== "string" || address === undefined) {
        console.log(`Session Hijacking (entities/users.js), setting User Address: address is ${address}, Test 2 failed`);
        return false;
    }
    console.log(`Session Hijacking (entities/users.js), setting User Address: hashed address is defined, Test 2 passed`);

    try
    {
        let targetUser = await getUserByUserid(userid);
        const salt = targetUser.salt;
        const hashedAddress = encrypt.hashPassword(encrypt.pepper(address), salt);
        
		const sql = 'UPDATE users SET latestaddress = $1 WHERE userid = $2;';
        let response = await database.query(sql, [hashedAddress, userid]);

        if (response.affectedRows === 0) {
            console.log(`Session Hijacking (entities/users.js), setting User Address: no rows were affected, Test 3 failed`);
            return false;
        }
        
        console.log(`Session Hijacking (entities/users.js), setting User Address: rows were affected, Test 3 passed`);
        return true;
    }
    catch (error)
    {
        console.log(`Session Hijacking (entities/users.js), setting User Address: query encountered an error, Test 3 failed`);
        return false;
    }
}


async function checkUserAddress(userid, address)
{
    if (userid === null || userid === undefined) {
        console.log(`Session Hijacking (entities/users.js), checking User Address: userid is ${userid}, Test 1 failed`);
        return false;
    }
    console.log(`Session Hijacking (entities/users.js), checking User Address: userid is defined, Test 1 passed`);

    if (typeof address !== "string" || address === undefined) {
        console.log(`Session Hijacking (entities/users.js), checking User Address: address is ${address}, Test 2 failed`);
        return false;
    }
    console.log(`Session Hijacking (entities/users.js), checking User Address: address is defined, Test 2 passed`);

    try
    {
        let targetUser = await getUserByUserid(userid);
        const salt = targetUser.salt;
        const hashedAddress = encrypt.hashPassword(encrypt.pepper(address), salt);

        if (targetUser.latestaddress === hashedAddress)
        {
            console.log("Session Hijacking (entities/users.js), checking User Address: user IP address matches the one on the DB, Test 4 passed");
            return true;
        }
        console.log("Session Hijacking (entities/users.js), checking User Address: query successfully executed, Test 3 passed");

    }
    catch (error)
    {
        console.log("Session Hijacking (entities/users.js), checking User Address: query failed executing, Test 3 failed");
        return false;
    }

    console.log("Session Hijacking (entities/users.js), checking User Address: user IP address DOES NOT match the one on the DB, Test 4 failed");
    return false;
}

module.exports.login = login;
module.exports.signup = signup;
module.exports.getUserByUserid = getUserByUserid;
module.exports.getEmailByUserid = getEmailByUserid;
module.exports.setUserAddress = setUserAddress;
module.exports.checkUserAddress = checkUserAddress;
module.exports.checkUsernameExists = checkUsernameExists;
