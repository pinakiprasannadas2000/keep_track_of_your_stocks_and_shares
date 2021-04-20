const mongoose = require('mongoose')
const dateValidator = require('is-my-date-valid')
const validateDate = dateValidator({ format: 'DD-MMMM-YYYY' })

const buyStockSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validateDate(value)) {
                throw new Error('Invalid date')
            }
        }
    },
    shareName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value === '') {
                throw new Error('Invalid entry')
            }
        }
    },
    averageBuyingPrice: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Invalid amount')
            }
        }
    },
    numberOfSharesBought: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Invalid amount')
            }
        }
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const BuyStock = mongoose.model('BuyStock', buyStockSchema)

module.exports = BuyStock