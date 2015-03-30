var Channel = require('./channel').Channel;

var productAttributeValue = {

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

    channels: [Channel]

};

/** export schema */
module.exports = {
    ProductAttributeValue: productAttributeValue
};