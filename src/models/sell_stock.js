const mongoose = require('mongoose')
const dateValidator = require('is-my-date-valid')
const validateDate = dateValidator({ format: 'DD-MMMM-YYYY' })

const sellStockSchema = mongoose.Schema({
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
            if (value == '') {
                throw new Error('Invalid entry')
            }
        }
    },
    averageSellingPrice: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Invalid amount')
            }
        }
    },
    numberOfSharesSold: {
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

const SellStock = mongoose.model('SellStock', sellStockSchema)

module.exports = SellStock