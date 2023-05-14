// const route = require("./routes/route")
// const mongoose = require("mongoose") ; 
// const express = require("express") ;

// const app = express() ;

// app.use(express.json()) ;

// mongoose.set('strictQuery' , true ) ;
// mongoose.connect("mongodb+srv://SagarMaan:yHJBlRWQ0FdJmdj6@chaudhary-shaab-db.cueddss.mongodb.net/Task_Managment" ,{useNewUrlParser : true} )
// .then(()=> {
//     console.log("MongoDB is connect.")
// })
// .catch((error) => {
//     console.log(error.message)
// })

// app.use("/" , route)

// app.listen( 3000 , () => {
//     console.log(`Server is running on ${3000}`)
// } )




const express = require('express')
require('dotenv').config();
const route = require('./routes/route')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
})
    .then(() => {console.log("MongoDB is connected")})
    .catch((err) => {console.log(err.message)})

app.use("/", route)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port 3000")
})    
