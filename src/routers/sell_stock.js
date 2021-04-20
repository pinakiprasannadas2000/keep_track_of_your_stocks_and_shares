const express = require('express')
const SellStock = require('../models/sell_stock')
const auth = require('../middleware/auth')

const router = express.Router()

// create new sold stocks entry
router.post('/stocksSold', auth, async(req, res) => {
    const currentStocksData = new SellStock({
        ...req.body,
        owner: req.user._id
    })

    try {
        await currentStocksData.save()
        res.send({
            result: 'New sold stock data created',
            DataCreated: currentStocksData
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get all sold stocks data
// GET /stocksSold?date=12-April-2021
// GET /stocksBought?shareName=TATA ELXSI
router.get('/stocksSold', auth, async(req, res) => {
    const match = {}

    if (req.query.date) {
        match.date = req.query.date
    }

    if (req.query.shareName) {
        match.shareName = req.query.shareName
    }

    try {
        await req.user.populate({
            path: 'stocksSold',
            match,
            options: {
                limit: 10
            }
        }).execPopulate()

        res.send({
            result: 'Found',
            dataFound: req.user.stocksSold
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get a particular sold stock data
router.get('/stocksSold/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const stock = await SellStock.findOne({ _id, owner: req.user._id })
        if (!stock) {
            return res.send({
                result: 'No such stock data is created'
            })
        }
        res.send({
            result: 'Found',
            DataFound: stock
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// update a particular sold stock data
router.patch('/stocksSold/:id', auth, async(req, res) => {
    const _id = req.params.id

    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['date', 'shareName', 'averageSellingPrice', 'numberOfSharesSold', 'description']
    const isAllowedOperation = requestedUpdates.every((requestedUpdate) => {
        return allowedUpdates.includes(requestedUpdate)
    })

    if (!isAllowedOperation) {
        return res.send({
            error: 'Invalid requested updates'
        })
    }

    try {
        const stock = await SellStock.findOne({ _id, owner: req.user._id })

        if (!stock) {
            return res.send({
                result: 'No such stock data is created'
            })
        }

        requestedUpdates.forEach((requestedUpdate) => {
            stock[requestedUpdate] = req.body[requestedUpdate]
        })

        await stock.save()

        res.send({
            result: 'Updated',
            dataUpdated: stock
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete all sold stocks data
router.delete('/stocksSold', auth, async(req, res) => {
    try {
        await SellStock.deleteMany({ owner: req.user._id })
        res.send({
            result: 'Deleted all'
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete a particular sold stock data
router.delete('/stocksSold/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const deletedStock = await SellStock.findByIdAndDelete({ _id, owner: req.user._id })
        res.send({
            result: 'Deleted',
            dataDeleted: deletedStock
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

module.exports = router