const bcrypt = require('bcrypt');
const Cryptojs = require("crypto-js")


function hashPassword(password, salt)
{
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

// password: plain text password from login input box
async function isMatch(password, stored_password, salt)
{
    
    if (hashPassword(password, salt) === stored_password){
        return true
    }else{
        return false
    }
}

function generateSalt()
{
    const costFactor = 12;
    return bcrypt.genSaltSync(costFactor);
}

function pepper(password)
{
    // Do not store in database!
    // This is only a security threat if the application code is leaked
    pepper = 465616374859591717264849n
    peppered_password = password + pepper;

    
    return peppered_password;
}

function encrypt(value,salt){
    const encryptedData = Cryptojs.AES.encrypt(value,salt).toString();
    return encryptedData
} 

function decrypt(value,salt){
    const decryptedData = Cryptojs.AES.decrypt(value,salt).toString(Cryptojs.enc.Utf8);
    return decryptedData
}


module.exports = 
{
    hashPassword,
    isMatch,
    generateSalt,
    pepper,
    encrypt,
    decrypt
}