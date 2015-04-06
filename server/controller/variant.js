'use strict';

var Boom = require('boom'),
    Variant = require('../model/variant').Variant;

exports.createVariant = {
    handler: function(request, reply) {
        Variant.createVariant(request.payload, function(err, response) {
            if (!err) reply(response);
            else reply(Boom.forbidden(err));
        });
    }
};

exports.getVariants = {
    handler: function(request, reply) {
        Variant.getVariants(function(err, result) {
            if (!err) {
                reply(result);
            } else reply(Boom.forbidden(err));
        });
    }
};

exports.updateVariant = {
    handler: function(request, reply) {
        Variant.updateVariant(request.params.id, request.payload, function(err, result) {
            if (!err) {
                return reply(result);
            } else reply(Boom.forbidden(err));
        });
    }
};