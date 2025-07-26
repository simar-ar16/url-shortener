const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    role:{
        type: String,
        required: true,
        default: "NORMAL",
    },
    password:{
        type:String,
        required: true,
    },
    isVerified: { type: Boolean, default: false },
},{
    timestamps:true,
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if changed/created
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User=mongoose.model('user', userSchema)

module.exports=User;