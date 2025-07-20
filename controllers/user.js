const {v4 :uuidv4} = require('uuid');
const User=require('../models/user');
const {setUser}=require('../service/auth')

/* Signup is simply handled when a user signs up then simply his data is stored in the db */
async function handleUserSignup(req,res){
    const{name,email,password} = req.body;

      const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Re-render signup page with error message
    return res.render('signup', { error: 'Email already in use' });
  }
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect('/');
}

/** for login, we first take input from user and check whether valid credentials are present in db or not.
 * If not user is invalid, if user is valid then after login server sends a uid as token to the browser for future
 * authentication. Everytime user sends any request to server, server verifies the token is valid or not.
 * If valid then request is processed if not that means user is not logged in and invalid
 */
async function handleUserLogin(req,res){
    const{email,password} = req.body;
    const user=await User.findOne({email,password}); 
    if(!user) return res.render('login', {
        error: "Invalid Username or Password",
    });
    const token = setUser(user);
    res.cookie('token',token);
    return res.redirect("/");
}

module.exports={
    handleUserSignup,
    handleUserLogin,
} 