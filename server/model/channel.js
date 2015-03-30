var channel = {

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
    language: {
        type: String
    },

    channel: [{
        type: String
    }]

};

/** export schema */
module.exports = {
    Channel: channel
};