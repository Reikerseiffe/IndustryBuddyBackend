const DB = require('./db.js')
var fs = require('fs');

module.exports = class Common{
    static cleanUpDBQuery(item){
        let temp = JSON.stringify(item)
        return JSON.parse(temp)
    }

    //Get the typeID for a typeName
    static getDataForTypeName(typeName){
        return new Promise(resolve =>{
            let sql  = `SELECT * FROM EVE_SDE.invTypes where typeName = "${typeName}"`
            DB.query(sql, this.typeName, function(error, results, fields){
                resolve(Common.cleanUpDBQuery(results)[0])
            })
        })
    }

    //Get the raw list of materials from the DB
    static getMaterialsForItemName(item){
        return new Promise(resolve =>{
            let sql = ""
            console.log(item.typeName + ": " + item.groupID)

            //Reacted components
            switch (item.groupID){
                case 428: //Intermediate Materials
                case 429: //Composite
                    sql  = fs.readFileSync('queries/CalculateReactionInputs.sql').toString()
                    break

                case 427: //Moon Materials
                case 18: //Mineral
                    resolve([])

                default://All else that doesnt need a drill down
                    sql  = fs.readFileSync('queries/CalculateInputsFromTypeID.sql').toString()
                    break

            }
            
            DB.query(sql, item.typeID, function(error, results, fields){
                if (error){
                    console.log(error)
                    console.log("ITEM: " + typeName)
                    resolve([])
                }

                resolve(results)
            })
        })
    }

    
}