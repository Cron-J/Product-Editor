var Boom = require('boom'),
    Product = require('../model/product').Product;

exports.createProduct = {
    handler: function(request, reply) {
        Product.createProduct(request.payload, function(err, response) {
            if (!err) reply(response);
            else reply(Boom.forbidden(err));
        });
    }
};

exports.searchProduct = {
    handler: function(request, reply) {
        var query = {};
        if (request.payload.productId) query['productId'] = new RegExp(request.payload.productId, "i");
        if (request.payload.classificationGroupId) query['classificationGroupAssociations.classificationGroupId'] = new RegExp(request.payload.classificationGroupId, "i");
        Product.searchProduct(query, function(err, result) {
            if (!err) {
                return reply(result);
            } else reply(Boom.forbidden(err));
        });
    }
};

exports.getProductById = {
     handler: function(request, reply) {
        Product.getProductById(request.params.id, function(err, result) {
            if (!err) {
                return reply(result);
            } else reply(Boom.forbidden(err));
        });
     }
};

exports.updateProduct = {
     handler: function(request, reply) {
        Product.updateProduct(request.params.id, request.payload, function(err, result) {
            if (!err) {
                return reply(result);
            } else reply(Boom.forbidden(err));
        });
     }
};