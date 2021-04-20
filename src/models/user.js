const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const BuyStock = require('../models/buy_stock')
const SellStock = require('../models/sell_stock')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// creating a virtual field 'stocksBought' for User model, which won't be stored in database but we can see all the incomes of that user
userSchema.virtual('stocksBought', {
    ref: 'BuyStock',
    localField: '_id',
    foreignField: 'owner'
        // this means here, the localField for the User model i.e. '_id' and foreignField for the User model i.e. 'owner' are connected
        // in otherwords, the 'owner' property of the 'BuyStock' model stores the '_id' of User object 
})

// creating a virtual field 'stocksSold' for User model, which won't be stored in database but we can see all the expenses of that user
userSchema.virtual('stocksSold', {
    ref: 'SellStock',
    localField: '_id',
    foreignField: 'owner'
        // this means here, the localField for the User model i.e. '_id' and foreignField for the User model i.e. 'owner' are connected
        // in otherwords, the 'owner' property of the 'SellStock' model stores the '_id' of User object 
})

// hiding private data of user such as password and auth-tokens
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// generating auth token for user after signup and each signin
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// logging in user by email and password
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// hash the password before saving the user
userSchema.pre('save', async function(next) {
    const currentUser = this

    if (currentUser.isModified('password')) {
        currentUser.password = await bcrypt.hash(currentUser.password, 8)
    }

    next()
})

// delete all the stocks bought and stocks sold createed by the user before deleting the user
userSchema.pre('remove', async function(next) {
    const currentUser = this

    await BuyStock.deleteMany({ owner: currentUser._id })
    await SellStock.deleteMany({ owner: currentUser._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User