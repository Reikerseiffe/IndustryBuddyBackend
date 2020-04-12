var mysql = require('mysql');
var fs = require('fs');
require('dotenv').config()


var connection = mysql.createConnection({
    host     : process.env.EVE_SDE_HOST,
    user     : process.env.EVE_SDE_USER,
    password : process.env.EVE_SDE_PASSWORD,
    database : process.env.EVE_SDE_DATABASE
});

console.log(process.env.EVE_SDE_HOST)


connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

let masterMaterialList = []

class ItemToBuild{
    constructor(typeName) {
        //Get TypeID for the item
        this.typeName = typeName;
        this.getTypeIDForTypeName(typeName).then(result => {
            this.typeID = result[0].typeID
            //adding in the promise so that fields are in the correct order when exporting
            this.inputs = []
        })
        
    }

    getTypeIDForTypeName(typeName){
        return new Promise(resolve =>{
            let sql  = `SELECT  typeID FROM EVE_SDE.invTypes where typeName = "${typeName}"`
            connection.query(sql, this.typeName, function(error, results, fields){
                resolve(results)
            })
        })
    }

    //Get the raw list of materials from the DB
    getMaterialsForItemName(){
        return new Promise(resolve =>{
            let sql  = fs.readFileSync('CalculateReactionInputsFromTypeName.sql').toString()
            connection.query(sql, this.typeName, function(error, results, fields){
                resolve(results)
            })
        })
    }

    //Remove the RawPacketData item from the raw mysql return value and format into usable json
    cleanUp(item){
        let temp = JSON.stringify(item)
        return JSON.parse(temp)
    }


    //Group everything together by groupID to make parsing down into sub-materials easier
    rebuildByGroupID(materials){
        //Iterate over every item in the materials list
        materials.map(item => {
            let workingGroup = this.inputs.find(group => group.groupID == item.groupID)

            // console.log(workingGroup)

            if(workingGroup == undefined){
                //Material does not exist yet
                let groupName = ""
                switch (item.groupID){
                    case 334:
                        groupName = "Components"
                        break
                    case 18:
                        groupName = "Minerals"
                        break
                    case 1034:
                        groupName = "Planetary Materials"
                        break
                    default:
                        groupName = "Items"
                        break
                }
                let newItem = {
                    groupID: item.groupID,
                    groupName: groupName,
                    materials: [
                        {
                            typeID: item.materialTypeID,
                            quantity: item.quantity,
                            typeName: item.typeName
                        }
                    ]
                }
                this.inputs.push(newItem)
            }else{
                //Material group exists
                //Check if the individual material exists
                // console.log("Found a match")
                let newItem = {
                        typeID: item.materialTypeID,
                        quantity: item.quantity,
                        typeName: item.typeName
                    }
                workingGroup.materials.push(newItem)
            }
        })
    }


    async calculateInputs(){
        //Get Raw materials
        let materials = await this.getMaterialsForItemName()
        //convert to useable format
        materials = this.cleanUp(materials)

        //Sort inputs into the correct grouping
        return new Promise(resolve =>{
            this.rebuildByGroupID(materials)
            resolve()
        })
    }

}


class Input{
    constructor(typeName, typeID, quantity) {
        this.typeName = typeName;
        this.typeID = typeID;
        this.quantity = quantity;
      }
}

let item = new ItemToBuild("Absolution")
item.calculateInputs().then(result => {
        console.log(JSON.stringify(item))
        connection.end()
})