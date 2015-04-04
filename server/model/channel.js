'use strict';

var channel = {

    /**
     * String representation of atrribute name to be specified in channel.
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
     * Identifier of Language used for channel.
     */
    language: {
        type: String
    },

    /**
     * List of channel for which attribute and it's value will be used. If channel is empty it means stands for all
     */
    channel: [{
        type: String
    }]

};

/** export schema */
module.exports = {
    Channel: channel
};