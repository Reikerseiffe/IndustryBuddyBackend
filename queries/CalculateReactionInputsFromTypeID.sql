SELECT industryActivityMaterials.*, invTypes.typeName FROM EVE_SDE.industryActivityMaterials 
inner join invTypes on industryActivityMaterials.materialTypeID = invTypes.typeID
where industryActivityMaterials.typeID = (
	SELECT industryActivityProducts.typeID FROM EVE_SDE.industryActivityProducts where productTypeID = ?
) ;