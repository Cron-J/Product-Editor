'use strict';

// dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    constants = require('../Utility/constants').constants,
    validator = require('mongoose-validators');


var VariantSchema = new Schema({

    /**
     * Id for varient.
     */
    variantId: {
        type: String,
        unique: true,
        required: true,
        validate: [ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
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

});

VariantSchema.statics.createVariant = function(varient, callback) {
    this.create(varient, callback);
};

VariantSchema.statics.searchVariant = function(query, callback) {
    this.find(query, callback);
};

VariantSchema.statics.updateVariant = function(id, variant, callback) {
    this.update({
        '_id': id
    }, variant, callback);
};

// export
var variant = mongoose.model('variant', VariantSchema);

/** export schema */
module.exports = {
    Variant: variant
};