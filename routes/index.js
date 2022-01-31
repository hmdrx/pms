var express = require('express');
const userModel = require('../modules/user');
const psCatModel = require('../modules/ps_cat')
const passwordModule = require('../modules/add_pass')
var router = express.Router();
var inc = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getPasCat = psCatModel.find({});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const bcrypt = require('bcryptjs/dist/bcrypt');

checkLoginUser = (req, res, next) => {
  var userToken = localStorage.getItem('userToken')
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch (err) {
    res.redirect('/')
  }
  next()
}

checkEmail = (req, res, next) => {
  var email = req.body.email;
  userModel.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Password Management System', msg: 'email already exists' });
    }
    next();
  })
}
checkUsername = (req, res, next) => {
  var username = req.body.uname;
  userModel.findOne({ username: username }, (err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Password Management System', msg: 'username already exists' });
    }
    next();
  })
}



/* GET home page. */
router.get('/', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('/dashboard')
  } else {

    res.render('index', { title: 'Password Management System', msg: '' });
  }
});
router.post('/', function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  userModel.findOne({ username: username }, (err, data) => {
    if (err) throw err;
    if (data == null) {
      res.render('index', { title: 'Password Management System', msg: 'invalid login' });
    } else {

      var getID = data._id;
      var getPassword = data.password;
      if (bcrypt.compareSync(password, getPassword)) {

        var token = jwt.sign({ foo: getID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);

        res.redirect('/dashboard');

        res.render('index', { title: 'Password Management System', msg: 'login successfully' });
      } else {

        res.render('index', { title: 'Password Management System', msg: 'invalid usrename and password' });
      }
    }

  });

});
router.get('/dashboard', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  res.render('dashboard', { title: 'Password Management System', loginUser: loginUser, msg: '' });
});
router.get('/signup', function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if (loginUser) {
    res.redirect('/dashboard')
  } else {
    res.render('signup', { title: 'Password Management System', msg: '' });
  }
});
router.post('/signup', checkEmail, checkUsername, function (req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;

  if (password != cpassword) {
    res.render('signup', { title: 'Password Management System', msg: 'password not matched' });

  } else {

    password = inc.hashSync(password, 10)
    var userDetails = new userModel({
      username: username,
      email: email,
      password: password
    });
    userDetails.save((err, doc) => {
      if (err) throw err;

      res.render('signup', { title: 'Password Management System', msg: 'user registered successfully' });
    })
  }


});
router.get('/p_category', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  psCatModel.find({},
    (err, data) => {

      if (err) throw err;

      res.render('ps_cat', { title: 'Password Management System', loginUser: loginUser, msg: '', records: data });
    })
  // getPasCat.exec((err,data)=>{
  // });

});
router.get('/p_category/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var psCatId = req.params.id;
  psCatModel.findByIdAndDelete(psCatId,(err,data)=>{
    if(err) throw err;
    res.redirect('/p_category')
  }) 
});
router.get('/p_category/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var psCatId = req.params.id;
  psCatModel.findById(psCatId,(err,data)=>{
    if(err) throw err;
    res.render('edit_ps_cat', { title: 'Password Management System', loginUser: loginUser,errors:'',success:'',id: psCatId, msg: '', records: data });
 
  }) 
});
router.post('/p_category/edit/', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var psCatId = req.body.id.trim();
  var psCat = req.body.catName;
  console.log(psCatId); 
  psCatModel.findByIdAndUpdate(psCatId,{ps_cat:psCat},(err,data)=>{
    if(err) throw err;
res.redirect('/p_category');
  }) 
});

router.get('/add_cat', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser')
  res.render('add_cat', { title: 'Password Management System', loginUser: loginUser, msg: '', errors: '', success: '' });
});

router.post('/add_cat', checkLoginUser, [check('catName', 'Enter password category name').isLength({ min: 1 })], function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  const err = validationResult(req);
  if (!err.isEmpty()) {

    res.render('add_cat', { title: 'Password Management System', loginUser: loginUser, msg: '', errors: err.mapped(), success: '' });
  } else {
    var passCat = req.body.catName;
    var psCatDetails = new psCatModel({
      ps_cat: passCat
    });
    psCatDetails.save((err, doc) => {
      if (err) throw err;

      res.render('add_cat', { title: 'Password Management System', loginUser: loginUser, msg: '', errors: '', success: 'Password category added' });
    })

  }
});
 
router.get('/ps_view', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');

  passwordModule.find({},(err,data)=>{
    if(err) throw err;
    res.render('ps_view', { title: 'Password Management System', loginUser: loginUser, msg: '',records:data });
  })
});

router.get('/ps/', checkLoginUser, function (req, res, next) {
  res.redirect('/dashboard')
});

router.get('/ps/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
var id = req.params.id;

  passwordModule.findById({_id:id},(err,data)=>{
    if(err) throw err;
    psCatModel.find({},
      (err, data1) => {
        if(err) throw err;
    res.render('edit_password', { title: 'Password Management System', loginUser: loginUser, msg: '',records:data1,record:data, success:'' });
  });
});
});
router.post('/ps/edit/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
var id = req.params.id;
var pass_cat = req.body.pass_cat;
var pro_name = req.body.pro_name;
var psDetail = req.body.password;
passwordModule.findByIdAndUpdate(id,{
  ps_cat: pass_cat,
  pro_name: pro_name,
  ps_details: psDetail
},(err,data)=>{
  if(err) throw err;
  

  passwordModule.findById({_id:id},(err,data)=>{
    if(err) throw err;
    psCatModel.find({},
      (err, data1) => {
        if(err) throw err;
res.redirect('/ps_view')
      });
});
});})

router.get('/add_ps', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  psCatModel.find({},(err,data)=>{
    if(err) throw err;
    
    res.render('add_ps', { title: 'Password Management System', loginUser: loginUser, msg: '',records: data,success:'' });
  });

});
router.post('/add_ps', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
var pass_cat = req.body.pass_cat;
var pass_details = req.body.password;
var pro_name = req.body.pro_name;

var psDetails = new passwordModule({
  ps_cat: pass_cat,
  ps_details:pass_details,
  pro_name:pro_name
});

psDetails.save((err,doc)=>{
  psCatModel.find({},(err,data)=>{
    if(err) throw err;

  res.render('add_ps', { title: 'Password Management System', loginUser: loginUser, msg: '',records: data,success:'password details added succesfully' });
})

  
    
  });

});

router.get('/ps/delete/:id', checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var id = req.params.id;
  var dell = passwordModule.findByIdAndDelete(id);
  dell.exec((err)=>{
    if(err) throw err;
    res.redirect('/ps_view')
  })
  //   passwordModule.findByIdAndDelete(psID,(err,data)=>{
  //   if(err) throw err;
  //   res.redirect('/')
  // }) 
});

router.get('/logout', checkLoginUser, function (req, res, next) {
  localStorage.removeItem('userToken')
  localStorage.removeItem('loginUser')
  res.redirect('/')
});

module.exports = router; 
