var fs = require('fs');
const DB = require('./db.js')

module.exports = class ItemToBuild{
    constructor(typeName) {
        //Get TypeID for the item
        this.typeName = typeName
        this.getTypeIDForTypeName(typeName).then(result => {
            this.typeID = result[0].typeID
            //adding in the promise so that fields are in the correct order when exporting
            this.inputs = []
        })
        
    }

    getTypeIDForTypeName(typeName){
        return new Promise(resolve =>{
            let sql  = `SELECT  typeID FROM EVE_SDE.invTypes where typeName = "${typeName}"`
            DB.query(sql, this.typeName, function(error, results, fields){
                resolve(results)
            })
        })
    }

    //Get the raw list of materials from the DB
    getMaterialsForItemName(typeName){
        return new Promise(resolve =>{
            let sql  = fs.readFileSync('queries/CalculateReactionInputsFromTypeName.sql').toString()
            DB.query(sql, typeName, function(error, results, fields){
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

    getSubmaterialForComponent(item){
        return new Promise(resolve => {
            this.getMaterialsForItemName(item.typeName).then(result =>{
                console.log(this.cleanUp(result))
                resolve(item.inputs = this.cleanUp(result))
            })
        })
    } 

    async getComponentSubMaterials(arrayOfItems){
        return Promise.all(arrayOfItems.map(item => this.getSubmaterialForComponent(item)))
    }


    async calculateBaseInputs(){
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