var mysql = require('mysql');
var fs = require('fs');
require('dotenv').config()
const ItemToBuild = require('./ItemToBuild')
const DB = require('./db')
const Reaction = require('./producable/Reaction')
const AdvancedComponent = require('./producable/AdvancedComponent')
const Common = require('./Common')





async function MaterialProcessor(){    
    
    let item = new ItemToBuild("Absolution")
    await item.loadDataForItem()
    item.calculateRecipe().then(result => {
            item.inputs = result

            //These are the initial materials to build the item
            console.log("\n\n\n\n*********************")
            console.log(JSON.stringify(item))
            // console.log("\n\n\n\n")
            // console.log(JSON.stringify(item.inputs.find(item => item.groupID == 334).materials))
            // console.log("\n\n\n\n")
            // item.getComponentSubMaterials(item.inputs.find(item => item.groupID == 334).materials).then(result => {
            //     console.log("SUBMATERIALS")
            //     console.log(JSON.stringify(item))
            // })
            DB.end()
    })

}

MaterialProcessor()

