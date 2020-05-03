SELECT industryActivityProducts.*, invTypes.typeName FROM EVE_SDE.industryActivityProducts
inner join invTypes on industryActivityProducts.typeID = invTypes.typeID
where productTypeID = ? 