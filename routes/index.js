var express = require('express');
var session = require('express-session');
var router = express.Router();
const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

router.use(session({
	secret:'secretsession',
	cookie:{maxAge:1800000, sameSite: 'strict'}, //cookie is valid for 10 minutes
	resave:false,
	saveUninitialized:false
}));

/* GET home page. */
router.get('/', async function(req, res)
{
  const profilepicid = req.session.profilepicid;

  if(req.session.authenticated === true)
  {
    console.log("cookie ID:" + req.sessionID)
    console.log(req.session.authenticated);
    res.render('index', { logged_in: true, profilepicid});
  }else{
    res.render('index', { logged_in: false});
  }
});


module.exports = router;
