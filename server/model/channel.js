'use strict';

var mongoose = require('../config/db').Mongoose,
    Schema = mongoose.Schema,
    constants = require('../Utility/constants').constants,
    validator = require('mongoose-validators');

var ChannelSchema = new Schema({

    /**
     * Id for channel.
     */
    channelId: {
        type: String,
        unique: true,
        sparse: true,
        required: true
    },

    /**
     * Identifier of Channel's Tenant this channel is listed in.
     */
    tenantId: {
        type: String,
        index: true,
        required: true,
        validate: [ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

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

});

ChannelSchema.statics.createChannel = function(channel, callback) {
    this.create(channel, callback);
};

ChannelSchema.statics.getChannelByTenantId = function(tenantId, callback) {
    this.find({
        'tenantId': tenantId
    }, callback);
};

// export
var channel = mongoose.model('channel', ChannelSchema);

/** export schema */
module.exports = {
    Channel: channel
};