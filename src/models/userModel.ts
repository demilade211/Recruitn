import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    companyName: {
        type: String,
        maxlength: [30, "Your name cannot exceed 30 characters"]

    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,// cant have more than one if this
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    }, 
    avatar: {
        public_id: {
            type: String,
            default: "App/user_mklcpl.png"
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png'
        }
    }, 
    role: {
        type: String,
        default: "company",
        enum: ['company', 'staff', 'admin']// specifies the only values that will be in role
    }, 
    resettoken: { type: String },
    expiretoken: { type: Date },
},
    { timestamps: true });

// Encrypting password before saving user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {// a check to confirm if the password is modified before encrypting it
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

export default mongoose.model("User", UserSchema);