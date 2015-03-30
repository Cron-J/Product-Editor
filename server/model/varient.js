var Product2ClassificationGroup = require('./product-classification-group').Product2ClassificationGroup,
    ProductAttributeValue = require('./product-attribute-value').ProductAttributeValue,
    Price = require('./price').Price,
    ContractedProduct = require('./contracted-product').ContractedProduct,
    ProductRelation = require('./product-relation').ProductRelation,
    ProductDocAssociation = require('./product-doc-association').ProductDocAssociation;

var variant = {

    /**
     * Attributes Id.
     */
    attributes: [{
        type: String
    }],

    hasVariantClassificationGroupAssociations: [Product2ClassificationGroup],

    hasVariantPrices: [Price],

    hasVariantDocAssociation: [ProductDocAssociation],

    hasVariantProductRelation: [ProductRelation],

    hasVariantContractedProducts: [ContractedProduct],

    hasVariantAttributeValues: [ProductAttributeValue]

};

/** export schema */
module.exports = {
    Variant: variant
};