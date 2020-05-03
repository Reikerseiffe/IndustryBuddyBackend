SELECT industryActivityMaterials.*, invTypes.typeName, invTypes.groupID, invGroups.groupName FROM EVE_SDE.industryActivityMaterials 
inner join invTypes on industryActivityMaterials.materialTypeID = invTypes.typeID 
join invGroups on invTypes.groupID = invGroups.groupID
where industryActivityMaterials.typeID in (
	SELECT industryActivityProducts.typeID FROM EVE_SDE.industryActivityProducts where productTypeID = ?
)