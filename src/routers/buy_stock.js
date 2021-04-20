const express = require('express')
const BuyStock = require('../models/buy_stock')
const auth = require('../middleware/auth')

const router = express.Router()

// create new bought stocks entry
router.post('/stocksBought', auth, async(req, res) => {
    const currentStocksData = new BuyStock({
        ...req.body,
        owner: req.user._id
    })

    try {
        await currentStocksData.save()
        res.send({
            result: 'New bought stock data created',
            DataCreated: currentStocksData
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get all bought stocks data
// GET /stocksBought?date=12-April-2021
// GET /stocksBought?shareName=TATA ELXSI
router.get('/stocksBought', auth, async(req, res) => {
    const match = {}

    if (req.query.date) {
        match.date = req.query.date
    }

    if (req.query.shareName) {
        match.shareName = req.query.shareName
    }

    try {
        await req.user.populate({
            path: 'stocksBought',
            match,
            options: {
                limit: 10
            }
        }).execPopulate()

        res.send({
            result: 'Found',
            DataFound: req.user.stocksBought
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get a particular bought stock data
router.get('/stocksBought/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const stock = await BuyStock.findOne({ _id, owner: req.user._id })
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

// update a particular bought stock data
router.patch('/stocksBought/:id', auth, async(req, res) => {
    const _id = req.params.id

    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['date', 'shareName', 'averageBuyingPrice', 'numberOfSharesBought', 'description']
    const isAllowedOperation = requestedUpdates.every((requestedUpdate) => {
        return allowedUpdates.includes(requestedUpdate)
    })

    if (!isAllowedOperation) {
        return res.send({
            error: 'Invalid requested updates'
        })
    }

    try {
        const stock = await BuyStock.findOne({ _id, owner: req.user._id })

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

// delete all bought stocks data
router.delete('/stocksBought', auth, async(req, res) => {
    try {
        await BuyStock.deleteMany({ owner: req.user._id })
        res.send({
            result: 'Deleted all'
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete a particular bought stock data
router.delete('/stocksBought/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const deletedStock = await BuyStock.findByIdAndDelete({ _id, owner: req.user._id })
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