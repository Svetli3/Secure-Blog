var express = require('express');
var session = require('express-session');
var router = express.Router();
const databaseController = require("../controllers/database_controller.js");
const encrypt = require('../controllers/encryption.js')
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const crypto = require('crypto');

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads') // Choose the folder where you want to store images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  }
});

const upload = multer({ storage: storage });

// generate CSRF token middleware
function generateCSRFToken(req, res, next) {
  const csrfToken = crypto.randomBytes(16).toString('hex');
  console.log(`Generated(backend) CSRF Token (routes/posts.js): ${csrfToken}`);
  session.csrfToken = csrfToken;
  req.csrfToken = csrfToken;

  console.log("CSRF, (routes/posts.js) generating a CSRF token to frontend and backend, Test 1 passed");

  next();
 }
 
// validate CSRF token middleware
function validateCSRFToken(req, res, next) {
  const csrfToken = session.csrfToken;
  console.log(`Validation(backend) CSRF Token (routes/posts.js): ${csrfToken}`);
  if (req.body.csrfToken === csrfToken) {
    console.log("CSRF, (routes/posts.js) comparing CSRF token from frontend to backend CSRF token, both tokens match, Test 1 passed");
    next();
  } else {
    console.log("CSRF, (routes/posts.js) comparing CSRF token from frontend to backend CSRF token, tokens DO NOT match, Test 1 failed");
    res.status(403).send('Invalid CSRF token');
  }
}

function regenerateCSRFToken(req, res)
{
	const csrfToken = crypto.randomBytes(16).toString('hex');
  console.log(`Regenerated(backend) CSRF Token (routes/posts.js): ${csrfToken}`);
	session.csrfToken = csrfToken;
  req.csrfToken = csrfToken;

	if (session.csrfToken = csrfToken) {console.log("CSRF, (routes/posts.js) regenerating a CSRF token to frontend and backend, Test 1 passed");}
  else {console.log("CSRF, (routes/posts.js) regenerating a CSRF token to frontend and backend, Test 1 failed");}

  return csrfToken
}







// --- CREATE POSTS ROUTES ---
router.get('/createPost', generateCSRFToken, async function(req, res)
{
  const userid = req.session.user;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

  // let isValidFileType = false;
  
  res.render('createpost', { title: 'Camel', csrfToken: req.csrfToken, userid});
});

router.get('/createPost/:invalidFileType', async function(req, res)
{
 
  const userid = req.session.user;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
    console.log("IDOR: UserID has been checked, Test 1 passed")
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

  isValidFileType = req.params.invalidFileType;

  res.render('createpost', { title: 'Camel', userid, isValidFileType});
});

router.post('/createPost', upload.single('image'), validateCSRFToken, async function(req, res)
{
  const userid = req.session.user;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
    console.log("IDOR: UserID has been checked, Test 1 passed")
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

  let warning_message = "Invalid file type, only PNG or JPG allowed";
  let isValidFileType = false;

  if (req.file !== undefined)
  {
    var type = req.file.originalname.split(".")[1];

    if (type === "jpg") {
      console.log("File upload: jpg authorised, Test 1 passed")
      isValidFileType = true;
    }
    else if (type === "png") {
      console.log("File upload: png authorised, Test 2 passed")
      isValidFileType = true;
    }
    else if (type === "jpeg") {
      console.log("File upload: jpeg authorised, Test 3 passed")
      isValidFileType = true;
    }
    else {
      isValidFileType = false;
      csrfToken = regenerateCSRFToken(req, res); 
      res.cookie('mycsrfToken', csrfToken);
      res.render("createpost", {warning_message, csrfToken: csrfToken, userid});
    }

  }else
  {
    isValidFileType = true;
  }
    
  if (isValidFileType)
  {
    let imgFilePath;
    if (req.file === undefined){
      imgFilePath = null
    }else{
      imgFilePath = "/images/uploads/" + req.file.filename;
    }



    details = ({ 
      image:imgFilePath,
      text:req.body.text
    })

    var response = await databaseController.addPost(details, userid);

    if (response)
    {
      res.redirect("/")
      res.status(200)

      return;
    }else
    {
      console.log("Error adding post | routes/create.js");
    }
    }
});



// --- DELETE POSTS ROUTES ---
router.delete('/deletePost/:id', async function(req, res)
{
	let postid = req.params.id;
  let userid = req.session.user;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

	var response = await databaseController.deletePost(postid, userid);
	
	if(response === true)
	{
	  res.status(200);
	  return;
	}
	else
	{
	  res.status(401);
    res.redirect('posts/error')
	  return;
	}
});



// --- EDIT POSTS ROUTES ---

router.get('/editpost/:id', generateCSRFToken, async function(req, res)
{
  const userid = req.session.user;
  let postid = req.params.id;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}
  
  var response = await databaseController.getPostByPostID(Number(postid));
  posttext = response.text
  postimage = response.image
  
  if (response.userid == userid && userid != undefined)
  {
    res.render('editpost', { title: 'Camel', csrfToken: req.csrfToken, userid, posttext, postid, postimage});
  }
  else
  {
	  res.redirect('posts/error')
	  return;
  }
});

router.get('posts/error', async function(req, res)
{
  res.render("error ", req.session.user);
  return
})

router.post('/editpost/:id', upload.single('image'), validateCSRFToken, async function(req, res, next)
{
  let text = req.body.posttext;
  let postid = req.params.id
  let userid = req.session.user;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

  let isValidFileType = false;
  let warning_message = "Invalid file type, only PNG or JPG allowed";
  
  if (req.file !== undefined)
  {
    var type = req.file.originalname.split(".")[1];

    if (type === "jpg") {isValidFileType = true;}
    else if (type === "png") {isValidFileType = true;}
    else if (type === "jpeg") {isValidFileType = true;}
    else {
      isValidFileType = false;
      csrfToken = regenerateCSRFToken(req, res);
      res.cookie('mycsrfToken', csrfToken); 
      res.render('editpost', { title: 'Camel', csrfToken: csrfToken, userid, posttext, postid, postimage, warning_message});
    }

  }else
  {
    isValidFileType = true;
  }
 
  if (isValidFileType)
  {
    let imgFilePath;
    if (req.file === undefined){
      imgFilePath = null
    }else{
      imgFilePath = "/images/uploads/" + req.file.filename;
    }

    // data collected from submitted form
    data = ({
      postid: Number(postid),
      image: imgFilePath,
      //video: "bob_likes_fossil_fuels.mp4",
      text: text
    })

    // warning messages
    warning_message = "Post needs at least one word of text!"

    // Checking whether the text is empty
    if(data.text.length < 1)
    {
      data.error = warning_message
      res.send(`${response}: Post Could Not Be Editted.`)
      res.status(401)
      return;
    }
    else
    {
      var response = await databaseController.editPost(data, userid);
    }

    if (response)
    {
      res.status(200).redirect("/users/viewprofile");
    }else{
      data.error = warning_message
      res.status(401)
    }

    // res.send(response);
    }

});

// router.post('/editpost/:id', async function(req, res)
// {
//   res.redirect("/users/viewprofile");
// });


// --- SEARCH POSTS ROUTES ---
router.get("/searchPosts/:searchText", async function (req, res)
{
	const searchText = req.params.searchText;
	const result = await databaseController.searchPosts(searchText);

	if (!result)
	{
    nopost = "No posts found"
		res.status(400).send({nopost});
	}
	else
	{
		res.status(200).send(result);
	}
});

router.get("/searchMyPosts/:searchText", async function (req, res)
{
	const searchText = req.params.searchText;
  const userid = req.session.user;

  addressArray = req.ip.toString().split(":");
	address = addressArray[addressArray.length - 1];
	if (!(await databaseController.checkUserAddress(userid, address)) && userid)
	{
		res.send("SESSION HIJACKING DETECTED!");
		return;
	}

	const result = await databaseController.searchMyPosts(searchText,userid);

	if (!result)
	{
    nopost = "No posts found"
		res.status(400).send({nopost});
	}
	else
	{
		res.status(200).send(result);
	}
});


router.get('/getLatest', async function(req, res)
{
	let response = await databaseController.generateLatestPosts()

	if (!response)
	{
		res.status(400).send(false);
	}
	else
	{
		res.status(200).send(response);
	}
});



module.exports = router;
