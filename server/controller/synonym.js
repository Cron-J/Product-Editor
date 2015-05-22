'use strict';

var Boom = require('boom'),
    Synonym = require('../model/synonym').Synonym;

exports.createSynonym = {
    handler: function(request, reply) {
        Synonym.createSynonym(request.payload, function(err, response) {
            if (!err) reply(response);
            else reply(Boom.forbidden(err));
        });
    }
};

exports.getSynonym = {
    handler: function(request, reply) {
        Synonym.getSynonyms(function(err, result) {
            if (!err) {
                return reply(result);
            } else reply(Boom.forbidden(err));
        });
    }
};

exports.updateSynonym = {
    handler: function(request, reply) {
        if (request.payload.field == undefined){
            return reply(Boom.forbidden("missing field name"));
        }
        else{
            Synonym.updateSynonym(request.payload.field, request.payload, function(err, result) {
                if (!err) {
                    return reply(result);
                } else reply(Boom.forbidden(err));
            });
        }
    }
};
