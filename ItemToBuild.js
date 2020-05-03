var fs = require('fs');
const DB = require('./db')
const Common = require('./Common')
const AdvancedComponent = require('./producable/AdvancedComponent')

module.exports = class ItemToBuild{
    constructor(typeName) {
        //Get TypeID for the item
        this.typeName = typeName
        
    }

    loadDataForItem(){
        return new Promise((resolve) =>{
            Common.getDataForTypeName(this.typeName).then(result => {
                this.typeID = result.typeID
                this.groupID = result.groupID
                resolve()
            })
        })
    }



    // This was to get all subcomponents before handling each one by itself
    getSubmaterialsForItem(item){
        return new Promise(resolve => {
            Common.getMaterialsForItemName(item.typeName, item.groupID).then(result =>{
                // console.log(Common.cleanUpDBQuery(result))
                //Result is all the inputs for the item passed in

                //call this function again with all of the submaterials
                Promise.all(result.map(async subItem => {
                    subItem.inputs = await this.getSubmaterialsForItem(subItem)}
                )).then(subItemResult =>{
                    resolve(result)
                })

                
            })
        })
    } 

    // async getComponentSubMaterials(arrayOfItems){
    //     return Promise.all(arrayOfItems.map(item => this.getSubmaterialForComponent(item)))
    // }





    async calculateRecipe(){
        // return Promise.all(arrayOfItems.map(item => this.getSubmaterialForComponent(item)))

        console.log("calculateRecipe")
        return new Promise(async resolve => {
            resolve(this.inputs = await this.getSubmaterialsForItem(this))
        })
        

        // return await 

        //     let materials = await Common.getMaterialsForItemName(this.typeName, this.groupID)

        //     return Promise.all(materials.map(item => this.getSubmaterialsForItem(item)))




            // // console.log(materials)

            // return Promise.all(
            //     materials.map(async (item) => {
            //         console.log(item)

            //         if(item.materialTypeID == 11537){
            //             console.log("\n\n\n\nRunning " + item.typeName)
            //             item.inputs = await this.calculateBaseInputs(item)
            //             this.inputs.push(item)
            //         }else{
            //             console.log("Skipping " + item.typeName)
            //         }
                    
            //     })
            // )
           
            //Wait for eveything else to be finshed
            //TODO: Move component functionality out to its class and deligate handling
            //TODO: Does this handle calling for the advanced component inputs?
                //Call during regroup? this could kist call down the stack and sum back up the return stack when its done
            //TODO: Does this handle calling for the reaction inputs?

    }

    // //Group everything together by groupID to make parsing down into sub-materials easier
    // rebuildByGroupID(materials){
    //     materials.map(item => {
    //         //Item is a single input into the master item (component, reaction, cap part, ect.)
    //         let workingGroup = this.inputs.find(group => group.groupID == item.groupID)
    //         if(workingGroup == undefined){
    //             //Material does not exist yet
    //             if (item.groupID == 334){
    //                 let component = new AdvancedComponent(item.typeName, item.typeID, item.quanitity)
    //             }

    //             let newItem = {
    //                 groupID: item.groupID,
    //                 groupName: groupName,
    //                 materials: [
    //                     {
    //                         typeID: item.materialTypeID,
    //                         quantity: item.quantity,
    //                         typeName: item.typeName
    //                     }
    //                 ]
    //             }
    //             this.inputs.push(newItem)
    //         }else{
    //             //Material group exists
    //             //Check if the individual material exists
    //             // console.log("Found a match")
    //             let newItem = {
    //                     typeID: item.materialTypeID,
    //                     quantity: item.quantity,
    //                     typeName: item.typeName
    //                 }
    //             workingGroup.materials.push(newItem)
    //         }
    //     })
    // }

    


    // async calculateBaseInputs(item){
    //     //returns item passed in with inputs added

    //     return new Promise(async (resolve) =>{
    //         //Get Raw materials for item
    //         if (item.groupID == 334){
    //             //item is an advanced component

    //             console.log("\n\n\nGetting sub materials for: " + item.typeName)

    //             // let component = new AdvancedComponent(item.typeName, item.typeID, item.quanitity)
    //             //Have the item get its sub materials and then add it to the input array
    //             let inputs = await Common.getMaterialsForItemName(item.typeName)
    //             console.log("\n\n\nGetting base materials for: " + item.typeName + " With inputs: ")
    //             console.log(inputs)

    //             return Promise.all(item.inputs = await inputs.map(async (newSubItem) => {
    //                 //call this function again getting all of the input materials
    //                 let newInputs = await this.calculateBaseInputs(newSubItem)
    //                 console.log("\n\n\nGot sub materials for: " + newSubItem.typeName + " With inputs: ")
    //                 console.log(newInputs)
    //                 return(newInputs)
    //             }))
                
    //         }else{
    //             item.inputs = []
    //             console.log("\n\n\nreaction for: ")
    //             console.log(item)
    //             resolve(item)
    //         }
    //         resolve(item)

    //     })
    // }


    

}