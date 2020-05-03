SELECT industryActivityMaterials.typeID as parentTypeID, industryActivityMaterials.activityID, industryActivityMaterials.materialTypeID as typeID, industryActivityMaterials.quantity, invTypes.typeName, invTypes.groupID, invGroups.groupName FROM EVE_SDE.industryActivityMaterials 
inner join invTypes on industryActivityMaterials.materialTypeID = invTypes.typeID 
join invGroups on invTypes.groupID = invGroups.groupID
where industryActivityMaterials.typeID = (
	#Get the typeID of the bueprint that results in the production of the item passed in
    #45732 is a test reaction blueprint so never select it
	SELECT industryActivityProducts.typeID FROM EVE_SDE.industryActivityProducts where productTypeID = ? and typeID != 45732
)