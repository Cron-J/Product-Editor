'use strict';

// dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var VariantSchema = new Schema({

    /**
     * Identifier of list of product attribute.
     */
    attributes: [{
        type: String
    }],

    /**
     * Identifier of product.
     */
    productId: {
        type: String
    },

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

VariantSchema.statics.getVariantsByProductId = function(productId, callback) {
    this.findOne({
        'productId': productId
    }, callback);
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