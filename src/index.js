const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const boughtStocksRouter = require('./routers/buy_stock')
const soldStocksRouter = require('./routers/sell_stock')
const totalRouter = require('./routers/total')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(boughtStocksRouter)
app.use(soldStocksRouter)
app.use(totalRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})