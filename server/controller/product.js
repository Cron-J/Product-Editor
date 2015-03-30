var Boom = require('boom'),
    Product = require('../model/product').Product,
    fs = require('fs'),
    async = require('async'),
    filePath = require('../config/config').filePath;

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
        if (request.payload.classificationGroupId) query['varients.hasVariantClassificationGroupAssociations.classificationGroupId'] = new RegExp(request.payload.classificationGroupId, "i");
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
                if(result.documents.length > 0){
                    async.each(result.documents, function(file, callback) {
                        if(file.path !== undefined){
                              var logo = file.path;
                              var imag_ext = logo.slice(logo.lastIndexOf('.')).slice(1);
                              var re = 'data:image/'+imag_ext+';base64,';
                              logo = __dirname + filePath.directory + filePath.subdirectory + '/' + logo;

                              fs.readFile(logo, function(err, show){
                                if(err){
                                  console.log(err);
                                file.path = "image not found";
                                callback();
                                }
                                else{
                                  var base64Image = new Buffer(show, 'binary').toString('base64');
                                  base64Image = re + base64Image;
                                  file.path = base64Image;
                                  callback();
                                  }
                              });
                        }
                        else{
                            callback();
                        }

                    }, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            return reply(result);
                        }
                    });
                }
                else{
                    return reply(result);
                }
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