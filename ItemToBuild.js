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
            Common.getMaterialsForItemName(item).then(result =>{
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


    async calculateRecipe(){
        // return Promise.all(arrayOfItems.map(item => this.getSubmaterialForComponent(item)))

        console.log("calculateRecipe")
        return new Promise(async resolve => {
            resolve(this.inputs = await this.getSubmaterialsForItem(this))
        })
        
            //Wait for eveything else to be finshed
            //TODO: Move component functionality out to its class and deligate handling
            //TODO: Does this handle calling for the advanced component inputs?
                //Call during regroup? this could kist call down the stack and sum back up the return stack when its done
            //TODO: Does this handle calling for the reaction inputs?

    }

}