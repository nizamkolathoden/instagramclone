
const express = require("express");
const app = express()
const port = process.env.port|| 8000
const mongoose = require("mongoose")
const { MONGOURI } = require('./key')
//middle ware
app.use(express.json())
const router = require("./routers/auth")
//maybe; require and using same line of code
app.use(require("./routers/post"))
app.use(require('./routers/user'))
app.use(router)
require("./models/user")
require("./models/post")
//mongoose conection
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
//mongoose connection checking
mongoose.connection.on("connected", () => {
    console.log("connected to mongodb");
})


mongoose.connection.on("error", (e) => {
    console.log("error", e);
})


//server started
app.listen(port, () => console.log("conected to server:", port));
