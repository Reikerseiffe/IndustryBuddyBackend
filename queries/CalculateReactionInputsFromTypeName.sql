SELECT industryActivityMaterials.typeID, industryActivityMaterials.activityID, industryActivityMaterials.materialTypeID, industryActivityMaterials.quantity, invTypes.typeName, invTypes.groupID FROM EVE_SDE.industryActivityMaterials 
inner join invTypes on industryActivityMaterials.materialTypeID = invTypes.typeID
where industryActivityMaterials.typeID = (
	SELECT industryActivityProducts.typeID FROM EVE_SDE.industryActivityProducts where productTypeID = (
		SELECT  typeID FROM EVE_SDE.invTypes where typeName = ?
    )
) and industryActivityMaterials.activityID = 1 order by activityID;