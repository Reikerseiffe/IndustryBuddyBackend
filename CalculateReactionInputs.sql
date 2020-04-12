SELECT industryActivityMaterials.*, invTypes.typeName FROM EVE_SDE.industryActivityMaterials 
inner join invTypes on industryActivityMaterials.materialTypeID = invTypes.typeID
where industryActivityMaterials.typeID = "46174" ;