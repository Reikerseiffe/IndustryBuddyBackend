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
    constructor(typeName, typeID) {
        this.typeName = typeName;
        this.typeID = typeID;
        this.inputs = []
    }

    //Get the raw list of materials from the DB
    getMaterialsForItemName(item){
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

        // masterMaterialList.typeName = "Guardian"
        // masterMaterialList.typeID = 11987
        // masterMaterialList.subInput
        //Iterate over every item in the materials list
        materials.map(item => {
            let workingGroup = this.inputs.find(group => group.groupID == item.groupID)

            console.log(workingGroup)

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
                    case 3828:
                        groupName = "Planetary Materials"
                        break
                    case 332, 26:
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
                console.log("Found a match")
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
        let materials = await this.getMaterialsForItemName(this.typeName)
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

let item = new ItemToBuild("Guardian", 11987)
item.calculateInputs().then(result => {
        console.log(JSON.stringify(item))
        connection.end()
    })