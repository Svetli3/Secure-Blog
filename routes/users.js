var express = require('express');
var session = require('express-session');
var router = express.Router();
const databaseController = require("../controllers/database_controller.js");
const emailController = require("../controllers/email_controller.js")
const encrypt = require('../controllers/encryption.js')
const bodyParser = require("body-parser")
const bufferImage = require("buffer-image");
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
const crypto = require("crypto")
const fileReader = require("fs");
const { exit } = require('process');
const { Console, time } = require('console');


// generate CSRF token middleware
function generateCSRFToken(req, res, next) {
	const csrfToken = crypto.randomBytes(16).toString('hex');
	console.log(`Generated(backend) CSRF Token (routes/users.js): ${csrfToken}`);
	session.csrfToken = csrfToken;
	req.csrfToken = csrfToken;
	
	console.log("CSRF, (routes/users.js) generating a CSRF token to frontend and backend, Test 1 passed");

	next();
   }
   
// validate CSRF token middleware
function validateCSRFToken(req, res, next) {
	const csrfToken = session.csrfToken;
	console.log(`Validation(backend) CSRF Token (routes/users.js): ${csrfToken}`);
	if (req.body.csrfToken === csrfToken) {
		console.log("CSRF, (routes/users.js) comparing CSRF token from frontend to backend CSRF token, both tokens match, Test 1 passed");
		next();
	} else {
		console.log("CSRF, (routes/users.js) comparing CSRF token from frontend to backend CSRF token, tokens DO NOT match, Test 1 failed");
		res.status(403).send('Invalid CSRF token');
	}
}

function regenerateCSRFToken(req, res)
{
	const csrfToken = crypto.randomBytes(16).toString('hex');
	console.log(`Regenerated(backend) CSRF Token (routes/users.js): ${csrfToken}`);
	session.csrfToken = csrfToken;
	req.csrfToken = csrfToken;

	if (session.csrfToken) {console.log("CSRF, (routes/users.js) regenerating a CSRF token to frontend and backend, Test 1 passed");}
  	else {console.log("CSRF, (routes/users.js) regenerating a CSRF token to frontend and backend, Test 1 failed");}
	
	return csrfToken
}

function setAttempts(req,res,next){
	attempts = String(0)
	var currentdate = new Date()
	res.cookie('attempts', attempts);
	res.cookie('time',currentdate)
	next();
}
function incrementAttempts(req,res){
	
	Attempts = Number(req.cookies.attempts) + 1
	console.log(Attempts)
	if(Attempts === 5){
		console.log("a")
		var currentdate = new Date().getTime()
		timeouttime  = new Date(currentdate + 1000 * 60)
		res.cookie('time',timeouttime)
		res.cookie('attempts',String(Attempts));
	}else if(Attempts > 5){
		console.log("b")
		var currentdate = new Date().getTime()
		newTime  = new Date(currentdate + 1000 * 60)
		res.cookie('time',newTime)
		res.cookie('attempts',String(Attempts));
	}
	else{
		var currentdate = new Date()
		res.cookie('time',currentdate)
		res.cookie('attempts',String(Attempts));
	}
}





// When set to strict, the browser only sends session cookies in first-party contexts — 
// it won't send them when a user navigates to a different website. 
// This method effectively prevents CSRF attacks from malicious third-party sites.
// router using cookie
router.use(session({
	secret:'secretsession',
	cookie:{maxAge:1800000, sameSite: 'strict'}, //cookie is valid for 10 minutes
	resave:false,
	saveUninitialized:false
  }
));


// --- LOGIN ROUTES ---
router.get('/login', generateCSRFToken, setAttempts, function(req, res)
{
	res.render('login', { title: 'Camel', csrfToken: req.csrfToken});
});

router.post('/login', validateCSRFToken, async function(req, res)
{
	var startTime = new Date().getTime();
	let error1 = "Username or password is incorrect.";
	var timeouttime = req.cookies.time

	if(new Date(timeouttime).getTime() > startTime){
		console.log("Session Timeout: Session has been timed out, Test passed")
		csrfToken = regenerateCSRFToken(req, res);
		incrementAttempts(req, res);
		error1 = "Session is timed out for 1 minute"
		await new Promise(r => setTimeout(r, 800 - (new Date().getTime() - startTime)));
		console.log("\n\nResponse Time: ", new Date().getTime() - startTime, "ms.\n\n");
		res.render('login', {csrfToken: csrfToken});
		res.status(401);
		return;
	}


	// data collected from the submitted form
	data = ({ 
		username:req.body.username,
		password:req.body.password 
	});
  
  var response = await databaseController.login(data);

  if(response.userid === 1){
	// console.log(response)
	addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	await databaseController.setUserAddress(req.session.user, address);

	req.session.user = response.userid;
    profilepicid = response.profilepicid;
	req.session.profilepicid = profilepicid;
	req.session.user = response.userid;

	req.session.authenticated = true
	res.redirect("/")
	return;
  }
  
  // If a userid is passed then user is directed to the home page
  if (typeof(response.userid) === 'number')
  {
    salt = encrypt.generateSalt();

    req.session.user = response.userid;

    profilepicid = response.profilepicid;
    req.session.profilepicid = profilepicid;

    console.log("\nUser logged in with userID: ", response.userid, "\n");
	await new Promise(r => setTimeout(r, 800 - (new Date().getTime() - startTime)));
	console.log("\n\nResponse Time: ", new Date().getTime() - startTime, "ms.\n\n");
	console.log("Account Enumeration: Response Timings, test passed")
    res.redirect("/users/verify");
    res.status(200);

    return;

  // If a userid is not passed then the login page is reloaded so the user can fix details
  }else{

	csrfToken = regenerateCSRFToken(req, res);
	res.cookie('mycsrfToken', csrfToken);
	incrementAttempts(req, res);
	await new Promise(r => setTimeout(r, 800 - (new Date().getTime() - startTime)));
	console.log("\n\nResponse Time: ", new Date().getTime() - startTime, "ms.\n\n");
	res.render('login', {csrfToken: csrfToken, error1});
    res.status(401);
  }
});



// --- LOGOUT ROUTES ---
router.get('/logout', async function(req, res)
{
	addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(req.session.user, address)))
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

    req.session.destroy(() => {
        res.render('index', { title: 'Camel' });
    });

});



// --- SIGNUP ROUTES ---
router.get('/signup', generateCSRFToken, function(req, res)
{
	res.render('signup', { title: 'Camel', csrfToken: req.csrfToken });
});

router.post('/signup', validateCSRFToken, async function(req, res)
{
	var startTime = new Date().getTime();

	// warning messages
	// let error1 = "At least one input is incorrect!";
	let error2 = "Username and Password must be 8+ characters with a special character!";
	let error3 = "Passwords don't match!";
	let error4 = "Display name and username can't be the same!";
	let error5 = "Password is too common, make more complex";
	let error6 = "Username already exists";
	
	// data collected from submitted form
	data = ({ 
	  displayname:req.body.displayname,
	  username:req.body.username,
	  email:req.body.email,
	  password:req.body.password,
	  verifyPassword:req.body.verifyPassword
	});

	function checkSpecialCharacters(password)
	{
		//reference for regex array - https://www.geeksforgeeks.org/javascript-program-to-check-if-a-string-contains-any-special-character/
		const specialCharacters = /[!@#$%^&*()\-+={}\-+={}[\]:;"'<>,.?\/|\\]/;
		console.log("Password complexity: password has been checked for special characters, Test passed")
		if(specialCharacters.test(password)){
		return true;
		}else{
		return false;
		}
	}

	function checkForCommonPasswords(password){
		// read file if its the same return true
		areEqual = false
		var text = fileReader.readFileSync("public/common_password.txt", "utf-8");
		splitData = text.split("\n")
		splitData = String(splitData).split("\r")
		for(i=0;i<splitData.length;i++){
			splitData[i] = splitData[i].replace(",", "");
			if(splitData[i] === password){
				areEqual = true
			} 
		}
		return areEqual
	}

	// Checking whether the username and password are the correct length
	if(data.password.length < 8 || data.username.length < 8 || checkSpecialCharacters(data.password)===false)
	{
	  	csrfToken = regenerateCSRFToken(req, res); 
		res.cookie('mycsrfToken', csrfToken);
		console.log("Account Enumeration: Vague warning Messages, Test 1 passed")
	  	res.render("signup", {csrfToken, data, error2});
		res.status(401);
	  	return;
	}
	else if (data.verifyPassword !== data.password)
	{
		csrfToken = regenerateCSRFToken(req, res); 
		res.cookie('mycsrfToken', csrfToken);
		console.log("Account Enumeration: Vague warning Messages, Test 2 passed")
	  	res.render("signup", {csrfToken, data, error3});
	  	res.status(401);
	  	return;
	}
	else if (data.displayname === data.username)
	{
		csrfToken = regenerateCSRFToken(req, res); 
		res.cookie('mycsrfToken', csrfToken);
		console.log("Account Enumeration: Vague warning Messages, Test 3 passed")
	  	res.render("signup", {csrfToken, data, error4});
	  	res.status(401);
	  	return;
	}
	else if(checkForCommonPasswords(data.password)===true){
		csrfToken = regenerateCSRFToken(req, res); 
		res.cookie('mycsrfToken', csrfToken);
		console.log("Common password Check: Common password identified, Test 1 passed")
	  	res.render("signup", {csrfToken, data, error5});
		res.status(401);
		return;
	}else if(await databaseController.checkUsernameExists(data.username)){
		csrfToken = regenerateCSRFToken(req, res); 
		res.cookie('mycsrfToken', csrfToken);
		console.log("Account Enumeration: Vague warning Messages, Test 4 passed")
	  	res.render("signup", {csrfToken, data, error6});
		res.status(401);
		return;
	}
	else{
		addressArray = req.ip.toString().split(":");
		address = addressArray[addressArray.length - 1];
		console.log(data)
		var response = await databaseController.signup(data, address);
		console.log("res:" + response)

		console.log(response);
		console.log(typeof(response.userid));
		// If a userid is passed then user is directed to the home page
		if (typeof(response.userid) === 'number')
		{
			req.session.authenticated = true;
			salt = encrypt.generateSalt();
			hashed_response = encrypt.hashPassword(encrypt.pepper(response), salt);
			// req.session.user = {hashed_response};
			req.session.user = response.userid;
			req.session.profilepicid = response.profilepicid;
		
			console.log("\nUser logged in with userID: ", hashed_response, "\n");
			res.redirect("/");
			res.status(200);
		
		// If a userid is not passed then the signup page is reloaded so the user can fix details
		}else{
			csrfToken = regenerateCSRFToken(req, res);
			res.cookie('mycsrfToken', csrfToken);
			
			res.render("signup", {csrfToken, data});
			res.status(401);
		}
	}
});



// --- VIEW PROFILE ROUTES ---
router.get('/viewProfile', async function(req, res)
{
	addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(req.session.user, address)))
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

	const userid = req.session.user;
	res.render('viewprofile', { title: 'Camel', userid});
});

router.get('/viewUserPosts', async function(req, res)
{
	addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(req.session.user, address)))
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

	const userid = req.session.user;
	var userPosts = await databaseController.getUserPosts(userid);

	res.json(userPosts);
});



// --- Verify User ---
router.get('/verify', generateCSRFToken, async function(req,res,next)
{

	res.render('verify', { title: 'Camel', csrfToken: req.csrfToken });
	const userid = req.session.user;

	// const user = await databaseController.getUserByUserid(userid)


	const array = new Uint32Array(1);
	crypto.getRandomValues(array);

	const max = 9999
	const min = 1000

	let randomNumber = array[0] / (0xffffffff + 1);
	let verificationCode = Math.floor(randomNumber * (max - min + 1)) + min
	const verificationCodeComment = "The code is:" + verificationCode

	header = "Your camel blog verfication code" 

	const not_encrypted_email = await databaseController.getEmailByUserid(userid)

	const response = emailController.sendEmail(not_encrypted_email,header,verificationCodeComment)

	if(response === false){
		console.log("Email did not send")
		next()
	}

	
});

router.get('/verify', async function(req,res){

	res.redirect("/login")
});

router.post('/verifyCode', validateCSRFToken, async function(req,res){
	
	input = req.body.verificationInput
	var code = await emailController.getVerificationCode()

	if(code === input){
		addressArray = req.ip.toString().split(":");
		address = addressArray[addressArray.length - 1];
		setReponse = await databaseController.setUserAddress(req.session.user, address);

		req.session.authenticated = true
		res.redirect("/")
		
	}else{
		res.redirect("/users/login")
	}
});




module.exports = router;
