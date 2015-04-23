'use strict';

var variant = {

    /**
     * Id for varient.
     */
    variantId: {
        type: String,
        unique: true,
        sparse: true,
        required: true
    },

    /**
     * Identifier of list of product attribute.
     */
    attributes: [{
        type: String
    }],


    /**
     * Is used to decide whether varient need new Classification Group for a product.
     * Default selection is false.
     */
    hasVariantClassificationGroupAssociations: {
        type: Boolean,
        default: false
    },

    /**
     * Is used to decide whether varient need new Price for a product.
     * Default selection is false.
     */
    hasVariantPrices: {
        type: Boolean,
        default: false
    },

    /**
     * Is used to decide whether varient need new Doc Association for a product.
     * Default selection is false.
     */
    hasVariantDocAssociation: {
        type: Boolean,
        default: false
    },

    /**
     * Is used to decide whether varient need new Product Relation for a product.
     * Default selection is false.
     */
    hasVariantProductRelation: {
        type: Boolean,
        default: false
    },

    /**
     * Is used to decide whether varient need new Contracted Product for a product.
     * Default selection is false.
     */
    hasVariantContractedProducts: {
        type: Boolean,
        default: false
    },

    /**
     * Is used to decide whether varient need new Attribute Values for a product.
     * Default selection is false.
     */
    hasVariantAttributeValues: {
        type: Boolean,
        default: false
    }

};

/** export schema */
module.exports = {
    Variant: variant
};