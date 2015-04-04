'use strict';

var Channel = require('./channel').Channel;

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
     * String representation of value.
     */
    value: {
        type: String,
        required: true
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
    channels: [Channel]

};

/** export schema */
module.exports = {
    ProductAttributeValue: productAttributeValue
};