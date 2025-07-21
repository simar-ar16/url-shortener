const express=require('express');
const {handleUserSignup, handleUserLogin} = require('../controllers/user');
const router=express.Router();

router.post('/',handleUserSignup);
router.post('/login',handleUserLogin);

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get("/logout", (req, res) => {
    res.clearCookie("token"); // removes the token cookie
    return res.redirect("/login"); // redirect to login or homepage
});
module.exports=router;