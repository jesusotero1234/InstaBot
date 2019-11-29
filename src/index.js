//Program to open instagram Website and like all the photos that you want 
const path = require('path')
const express = require('express')
const port = process.env.PORT || 3000 
const app = express()

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))




app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})