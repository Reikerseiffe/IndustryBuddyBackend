var mysql = require('mysql');
var fs = require('fs');
require('dotenv').config()
const ItemToBuild = require('./ItemToBuild.js')
const DB = require('./db.js')



let item = new ItemToBuild("Absolution")
item.calculateBaseInputs().then(result => {
        //These are the initial materials to build the item
        console.log(JSON.stringify(item))
        console.log("\n\n\n\n")
        console.log(JSON.stringify(item.inputs.find(item => item.groupID == 334).materials))
        console.log("\n\n\n\n")
        item.getComponentSubMaterials(item.inputs.find(item => item.groupID == 334).materials).then(result => {
            console.log("SUBMATERIALS")
            console.log(JSON.stringify(item))
        })
        DB.end()
})


