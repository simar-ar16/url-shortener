const {v4 :uuidv4} = require('uuid');
const User=require('../models/user');
const {setUser}=require('../service/auth')
const otpGenerator = require('otp-generator');
const sendOtpEmail = require('../utils/sendOtp');


const otpStore = require('../utils/otpStore'); 


/* Signup is simply handled when a user signs up then simply his data is stored in the db */
async function handleUserSignup(req,res){
    const{name,email,password} = req.body;

      const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Re-render signup page with error message
    return res.render('signup', { error: 'Email already in use' });
  }
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
   otpStore.set(email, {
    name,
    password, // plain for now (we'll hash after OTP verification)
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
  });

  
  
 try {
    await sendOtpEmail(email, otp);
  } catch (e) {
    console.error(e);
    otpStore.delete(email);
    return res.render('signup', { error: 'Could not send OTP. Try again later.' });
  }
  return res.redirect(`/user/verify?email=${email}`);
}

/** for login, we first take input from user and check whether valid credentials are present in db or not.
 * If not user is invalid, if user is valid then after login server sends a uid as token to the browser for future
 * authentication. Everytime user sends any request to server, server verifies the token is valid or not.
 * If valid then request is processed if not that means user is not logged in and invalid
 */
async function handleUserLogin(req,res){
    const{email,password} = req.body;
    const user=await User.findOne({email}); 
    if(!user) return res.render('login', {
        error: "Invalid Username or Password",
    });

    const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.render('login', { error: 'Invalid email or password' });
  }
  if (!user.isVerified) {
    return res.render('login', { error: 'Please verify your email first.' });
  }

    const token = setUser(user);
    res.cookie('token',token);
    return res.redirect("/home");
}

module.exports={
    handleUserSignup,
    handleUserLogin,
} 