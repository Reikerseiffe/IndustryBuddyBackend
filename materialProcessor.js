var mysql = require('mysql');
var fs = require('fs');
require('dotenv').config()
const ItemToBuild = require('./ItemToBuild.js')
const DB = require('./db.js')

let item = new ItemToBuild("Absolution")
item.calculateInputs().then(result => {
        console.log(JSON.stringify(item))
        DB.end()
})