'use strict';

var productAttributeValue = {

    /**
     * Identifier of product variant.
     */
    variantId: {
        type: String
    },

    /**
     * Identifier of product attribute.
     */
    attribute: {
        type: String,
        required: true
    },

    /**
     * String representation of value or expression.
     */
    value: {
        type: String
    },

    /**
     * Javascript Expression which could be evaluated to get value.
     */
    valueExpression: {
        type: String
    },

    /**
     * Identifier of Language for multi language attribute.
     */
    languageId: {
        type: String
    },

    /**
     * Attribute value Order Number. It can be used for different kind sorting.
     */
    orderNro: {
        type: Number
    },

    /**
     * Identifier of product attribute value Status.
     */
    statusId: {
        type: String
    },

    /**
     * Each attribute value can have multiple channels.
     */
    channels: [{
        type: String
    }]

};

/** export schema */
module.exports = {
    ProductAttributeValue: productAttributeValue
};