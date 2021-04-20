const express = require('express')
const BuyStock = require('../models/buy_stock')
const SellStock = require('../models/sell_stock')
const auth = require('../middleware/auth')

const router = express.Router()

// get total
// GET total?date=12-April-2021
router.get('/total', auth, async(req, res) => {
    if (req.query.date) {
        const date = req.query.date

        var totalBoughtAmount = 0
        var totalSoldAmount = 0
        var grossTotal = 0
        var message = ''

        try {
            const allBoughtStocks = await BuyStock.find({ owner: req.user._id, date })
            const allSoldStocks = await SellStock.find({ owner: req.user._id, date })

            for (var i = 0; i < allBoughtStocks.length; i++) {
                totalBoughtAmount = totalBoughtAmount + allBoughtStocks[i].averageBuyingPrice * allBoughtStocks[i].numberOfSharesBought
            }

            for (var i = 0; i < allSoldStocks.length; i++) {
                totalSoldAmount = totalSoldAmount + allSoldStocks[i].averageSellingPrice * allSoldStocks[i].numberOfSharesSold
            }

            grossTotal = totalSoldAmount - totalBoughtAmount

            if (grossTotal > 0) {
                message = 'Profit'
            } else if (grossTotal < 0) {
                message = 'Loss'
            } else {
                message = 'Neither Profit nor Loss'
            }

            res.send({
                all_stocks_you_bought: allBoughtStocks,
                total_amount_you_spent_in_buying_stocks: totalBoughtAmount,
                all_stocks_you_sold: allSoldStocks,
                total_amount_you_got_from_selling_stocks: totalSoldAmount,
                gross_total: grossTotal,
                result: message
            })
        } catch (error) {
            res.send({
                error
            })
        }
    } else {
        var totalBoughtAmount = 0
        var totalSoldAmount = 0
        var grossTotal = 0
        var message = ''

        try {
            const allBoughtStocks = await BuyStock.find({ owner: req.user._id })
            const allSoldStocks = await SellStock.find({ owner: req.user._id })

            for (var i = 0; i < allBoughtStocks.length; i++) {
                totalBoughtAmount = totalBoughtAmount + allBoughtStocks[i].averageBuyingPrice * allBoughtStocks[i].numberOfSharesBought
            }

            for (var i = 0; i < allSoldStocks.length; i++) {
                totalSoldAmount = totalSoldAmount + allSoldStocks[i].averageSellingPrice * allSoldStocks[i].numberOfSharesSold
            }

            grossTotal = totalSoldAmount - totalBoughtAmount

            if (grossTotal > 0) {
                message = 'Profit'
            } else if (grossTotal < 0) {
                message = 'Loss'
            } else {
                message = 'Neither Profit nor Loss'
            }

            res.send({
                all_stocks_you_bought: allBoughtStocks,
                total_amount_you_spent_in_buying_stocks: totalBoughtAmount,
                all_stocks_you_sold: allSoldStocks,
                total_amount_you_got_from_selling_stocks: totalSoldAmount,
                gross_total: grossTotal,
                result: message
            })
        } catch (error) {
            res.send({
                error
            })
        }
    }
})

// GET total/TATA ELXSI
// GET total/TATA ELXSI?date=12-April-2021
router.get('/total/:shareName', auth, async(req, res) => {
    if (req.query.date) {
        const date = req.query.date
        const shareName = req.params.shareName

        var totalBoughtAmount = 0
        var totalSoldAmount = 0
        var grossTotal = 0
        var message = ''

        try {
            const allBoughtStocks = await BuyStock.find({ owner: req.user._id, shareName, date })
            const allSoldStocks = await SellStock.find({ owner: req.user._id, shareName, date })

            for (var i = 0; i < allBoughtStocks.length; i++) {
                totalBoughtAmount = totalBoughtAmount + allBoughtStocks[i].averageBuyingPrice * allBoughtStocks[i].numberOfSharesBought
            }

            for (var i = 0; i < allSoldStocks.length; i++) {
                totalSoldAmount = totalSoldAmount + allSoldStocks[i].averageSellingPrice * allSoldStocks[i].numberOfSharesSold
            }

            grossTotal = totalSoldAmount - totalBoughtAmount

            if (grossTotal > 0) {
                message = 'Profit'
            } else if (grossTotal < 0) {
                message = 'Loss'
            } else {
                message = 'Neither Profit nor Loss'
            }

            res.send({
                all_stocks_you_bought: allBoughtStocks,
                total_amount_you_spent_in_buying_stocks: totalBoughtAmount,
                all_stocks_you_sold: allSoldStocks,
                total_amount_you_got_from_selling_stocks: totalSoldAmount,
                gross_total: grossTotal,
                result: message
            })
        } catch (error) {
            res.send({
                error
            })
        }
    } else {
        const shareName = req.params.shareName

        var totalBoughtAmount = 0
        var totalSoldAmount = 0
        var grossTotal = 0
        var message = ''

        try {
            const allBoughtStocks = await BuyStock.find({ owner: req.user._id, shareName })
            const allSoldStocks = await SellStock.find({ owner: req.user._id, shareName })

            for (var i = 0; i < allBoughtStocks.length; i++) {
                totalBoughtAmount = totalBoughtAmount + allBoughtStocks[i].averageBuyingPrice * allBoughtStocks[i].numberOfSharesBought
            }

            for (var i = 0; i < allSoldStocks.length; i++) {
                totalSoldAmount = totalSoldAmount + allSoldStocks[i].averageSellingPrice * allSoldStocks[i].numberOfSharesSold
            }

            grossTotal = totalSoldAmount - totalBoughtAmount

            if (grossTotal > 0) {
                message = 'Profit'
            } else if (grossTotal < 0) {
                message = 'Loss'
            } else {
                message = 'Neither Profit nor Loss'
            }

            res.send({
                all_stocks_you_bought: allBoughtStocks,
                total_amount_you_spent_in_buying_stocks: totalBoughtAmount,
                all_stocks_you_sold: allSoldStocks,
                total_amount_you_got_from_selling_stocks: totalSoldAmount,
                gross_total: grossTotal,
                result: message
            })
        } catch (error) {
            res.send({
                error
            })
        }
    }
})

module.exports = router