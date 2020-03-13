const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const Mongoose = require('mongoose')
const AutoIncrement = require('mongoose-auto-increment')
const Routes = require('./routes')

// Options to use with mongoose (mainly to avoid deprecacy warnings)
const mongooseOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
}
// Connect to the MongoDB database
Mongoose.connect('mongodb://localhost:27017/financial-management', mongooseOptions)
// Use auto increment for models
AutoIncrement.initialize(Mongoose.connection)


// Create the Koa app
const app = new Koa()
// Create a router object
const router = new Router()
// Register all routes by passing the router to them
Routes(router)

// Register all middlewares, in the right order
app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(5000)