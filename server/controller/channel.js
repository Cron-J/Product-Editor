'use strict';

var Boom = require('boom'),
    Channel = require('../model/channel').Channel;

exports.createChannel = {
    handler: function(request, reply) {
        Channel.createChannel(request.payload, function(err, response) {
            if (!err) return reply(response);
            else return reply(Boom.forbidden(err));
        });
    }
};

exports.getChannelByTennantId = {
    handler: function(request, reply) {
        Channel.getChannelByTenantId(request.params.tenantId, function(err, response) {
            if (!err) reply(response);
            else reply(Boom.forbidden(err));
        });
    }
};