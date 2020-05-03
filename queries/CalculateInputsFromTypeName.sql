SELECT industryActivityMaterials.typeID AS parentTypeID, industryActivityMaterials.activityID, industryActivityMaterials.materialTypeID as typeID, industryActivityMaterials.quantity, invTypes.typeName, invTypes.groupID, invGroups.groupName
FROM EVE_SDE.industryActivityMaterials 
join invTypes on industryActivityMaterials.materialTypeID = invTypes.typeID join invGroups on invTypes.groupID = invGroups.groupID
where industryActivityMaterials.typeID = (
	SELECT industryActivityProducts.typeID FROM EVE_SDE.industryActivityProducts where productTypeID = (
		SELECT typeID FROM EVE_SDE.invTypes where typeName = ?
    )
) and industryActivityMaterials.activityID = 1 order by activityID;