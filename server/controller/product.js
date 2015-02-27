var Joi = require('joi'),
    Boom = require('boom'),
    Product = require('../model/product').Product,
    Product2ClassificationGroup = require('./product-classification-group');

exports.createProduct = {
    handler: function(request, reply) {
    	Product.createProduct(request.payload, function(err, response){
    		if(!err) reply(response) ;
    		else reply(Boom.forbidden(err));
    	});
    }
};

exports.searchProduct = {
    handler: function(request, reply) {        
    	if (request.payload.classificationGroupId !== undefined && request.payload.productId !== undefined){
            Product2ClassificationGroup.findProd2ClassiGrpByClassiGroupId(request.payload.classificationGroupId, request.payload.productId, function(err, result){
                if(!err){
                    if(result === null) return reply(result);
                    Product.findProductsByProductIdAndClassiGrpAss(request.payload.productId, result._id, function(err, res){
                        if(!err) reply(res) ;
                        else reply(Boom.forbidden(err));
                    });
                } 
                else reply(Boom.forbidden(err));
            });
        } 
        else if(request.payload.productId !== undefined) {
            Product.findProductsByProductId(request.payload.productId, function(err, result){
                if(!err) reply(response) ;
                else reply(Boom.forbidden(err));
            });
        }
        else reply("Invalid search parameters");
    }
};