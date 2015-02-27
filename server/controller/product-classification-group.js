var Joi = require('joi'),
    Boom = require('boom'),
    Product2ClassificationGroup = require('../model/product-classification-group').Product2ClassificationGroup;

exports.createProduct2ClassificationGroup = {
    handler: function(request, reply) {
    	Product2ClassificationGroup.createProduct2ClassificationGroup(request.payload, function(err, response){
    		if(!err) reply(response) ;
    		else reply(Boom.forbidden(err));
    	});
    }
};

exports.findProd2ClassiGrpByClassiGroupId = function(classificationGroupId, productId, callback){    
    	Product2ClassificationGroup.findProd2ClassiGrpByClassiGroupId(classificationGroupId, productId, callback);
};