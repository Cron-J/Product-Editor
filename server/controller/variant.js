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

exports.searchVariant = {
    handler: function(request, reply) {
        var query = {};
        if (request.payload.variantId) query['variantId'] = new RegExp(request.payload.variantId, "i");
        if (request.payload.hasVariantClassificationGroupAssociations) query['hasVariantClassificationGroupAssociations'] = request.payload.hasVariantClassificationGroupAssociations;
        if (request.payload.hasVariantPrices) query['hasVariantPrices'] = request.payload.hasVariantPrices;
        if (request.payload.hasVariantDocAssociation) query['hasVariantDocAssociation'] = request.payload.hasVariantDocAssociation;
        if (request.payload.hasVariantProductRelation) query['hasVariantProductRelation'] = request.payload.hasVariantProductRelation;
        if (request.payload.hasVariantContractedProducts) query['hasVariantContractedProducts'] = request.payload.hasVariantContractedProducts;
        if (request.payload.hasVariantAttributeValues) query['hasVariantAttributeValues'] = request.payload.hasVariantAttributeValues;

        Variant.searchVariant(query, function(err, result) {
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