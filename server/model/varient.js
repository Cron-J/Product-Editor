var variant = {

    /**
     * Attributes Id.
     */
    attributes: [{
        type: String
    }],

    /**
     * Varient name.
     */
    name: {
        type: String
    },

    /**
     * Description.
     */
    description: {
        type: String
    },    

    hasVariantClassificationGroupAssociations: {
        type: Boolean
    },

    hasVariantPrices: {
        type: Boolean
    },

    hasVariantDocAssociation: {
        type: Boolean
    },

    hasVariantProductRelation: {
        type: Boolean
    },

    hasVariantContractedProducts: {
        type: Boolean
    },

    hasVariantAttributeValues: {
        type: Boolean
    }

};

/** export schema */
module.exports = {
    Variant: variant
};