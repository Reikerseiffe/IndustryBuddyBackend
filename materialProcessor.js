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

function cleanUp(item){
    //Remove the RawPacketData item from the raw mysql return value and format into usable json
    let temp = JSON.stringify(item)
    return JSON.parse(temp)
}

let masterMaterialList = []


// getMaterialsForItemName("Guardian").then(result => {
//     console.log(result)
// })

caller("Guardian").then(result => {
    console.log(JSON.stringify(masterMaterialList))
    connection.end()
})

// async function typeIDFromTypeName(typeName){
//     return new Promise(resolve => {
//         connection.query('SELECT `typeID` FROM `invTypes` WHERE `typeName` = ?' ,[typeName], function(error, results, fields){
//             // console.log(cleanUp(results))
//             totalMaterials = cleanUp(results)
//             resolve(totalMaterials[0].typeID)
//         })
//       }); 
// }

// async function typeNameFromTypeID(typeID){
//     return new Promise(resolve => {
//         connection.query('SELECT `typeName` FROM `invTypes` WHERE `typeID` = ?' ,[typeName], function(error, results, fields){
//             // console.log(cleanUp(results))
//             totalMaterials = cleanUp(results)
//             resolve(totalMaterials[0].typeName)
//         })
//       }); 
// }

// function calculateReactionFormula(productTypeID){
//     return new Promise(resolve => {
//         connection.query('SELECT * FROM `industryActivityProducts` WHERE `productTypeID` = ?' ,[productTypeID], function(error, results, fields){
//             // console.log(cleanUp(results))
//             totalMaterials = cleanUp(results)
//             resolve(totalMaterials)
//         })
//       }); 
// }



// function calculateReactioninputs(formulaID){
//     return new Promise(resolve => {
//         connection.query('SELECT * FROM `industryActivityMaterials` WHERE `typeID` = ?' ,[formulaID], function(error, results, fields){
//             // console.log(cleanUp(results))
//             totalMaterials = cleanUp(results)
//             resolve(totalMaterials)
//         })
//       }); 
// }

// function calculateReactioninputsForArray(formulaIDs){
//     return new Promise(resolve => {
//         connection.query('SELECT * FROM `industryActivityMaterials` WHERE `typeID` in ?' ,[formulaIDs], function(error, results, fields){
//             // console.log(cleanUp(results))
//             totalMaterials = cleanUp(results)
//             resolve(totalMaterials)
//         })
//       }); 
// }

function getMaterialsForItemName(item){
    return new Promise(resolve =>{
        let sql  = fs.readFileSync('CalculateReactionInputsFromTypeName.sql').toString()
        connection.query(sql, item, function(error, results, fields){
            resolve(cleanUp(results))
        })
    })
}

function rebuildByGroupID(materials){

    // masterMaterialList.typeName = "Guardian"
    // masterMaterialList.typeID = 11987
    // masterMaterialList.subInpit
    materials.map(item => {
        let materialFromMaster = masterMaterialList.find(material => material.groupID == item.groupID)
        if(materialFromMaster == undefined){
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
            masterMaterialList.push(newItem)
        }else{
            //Material group exists
            //Check if the individual material exists

            let materialInGroup = materialFromMaster.materials.find(material => material.typeID == item.typeID)

            if(materialInGroup == undefined){
                materialFromMaster.materials.push({
                    typeID: item.materialTypeID,
                    quantity: item.quantity,
                    typeName: item.typeName
                })
            }else{
                materialInGroup.quantity += item.quantity
            }
        }
    })
}


async function breakdownAdvancedComponents(components){
    
}


async function caller(material){
    let materials = await getMaterialsForItemName(material)

    return new Promise(resolve =>{
        rebuildByGroupID(materials)
        resolve()
    })





    // //Get top end materials
    // let productTypeID = await typeIDFromTypeName("Ferrogel")
    // let formulaIDData = await calculateReactionFormula(productTypeID)

    // //If this is the first run through then create instead of append
    // if(listOfMaterials.length == 0){
    //     listOfMaterials = await calculateReactioninputs(formulaIDData[0].typeID)
    // }else{
    //     listOfMaterials.push(await calculateReactioninputs(formulaIDData[0].typeID))
    // }


    // let listOfInputIDs = []

    // listOfMaterials.map(item => {

    //     let newItem = {}

    //     newItem.typeName = typeNameFromTypeID(item.materialTypeID)
    //     newItem.typeID = item.materialTypeID
    //     newItem.quantity = item.quantity

    //     listOfInputIDs.push(newItem)
        
    // })


    // console.log(await listOfMaterials)

    // console.log("*************** inputs *******************")
    // console.log(listOfInputIDs)

    // // let secondInputs = calculateReactioninputsForArray(listOfMaterials)
    // // console.log(secondInputs)

    // connection.end();
}



 







// connection.query('SELECT `typeID`, `typeName` FROM `invTypes` WHERE `typeName` = "Guardian"', function(error, results, fields){
//     // console.log(cleanUp(results))
//     totalMaterials = cleanUp(results)
//     calculateBaseMaterials(cleanUp(results))
//     .then(function(){
//         console.log("We got to the end!")
//     })
// })

// async function calculateBaseMaterials(materials){


//         //Cycle through each item in the list and then call this function again until there are no more base materials found
//     let endOfSuming = true
//     for (let item of materials){

//         console.log(item)
//         let ID = ""
//         if(item.hasOwnProperty('materialTypeID')){
//             ID = item.materialTypeID
//         }else{
//             ID = item.typeID
//         }

//         connection.query('SELECT * FROM `invTypeMaterials` WHERE `typeID` = ' + ID, function (error, results, fields) {
//             // error will be an Error if one occurred during the query
//             // results will contain the results of the query
//             // fields will contain information about the returned results fields (if any)
//             if (error) throw error;

//             let mats = cleanUp(results)

//             // console.log(mats)

            

//             if (mats.length != 0){
//                 item.inputs = mats
//                 console.log(materials)

//                 calculateBaseMaterials(item.inputs)
//             }
//         });
//     }

//     // if(endOfSuming == true){
//     //     // connection.end();
//     //     console.log("TOTAL")
//     //     console.log(totalMaterials)
//     // }


// }

// function getCoffee() {
//     return new Promise(resolve => {
//       setTimeout(() => resolve('☕'), 2000); // it takes 2 seconds to make coffee
//     });
//   }



