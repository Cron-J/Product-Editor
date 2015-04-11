'use strict';

var Boom = require('boom'),
    Product = require('../model/product').Product,
    fs = require('fs'),
    async = require('async'),
    json2csv = require('json2csv'),
    filePath = require('../config/config').filePath,
    hostFromConfig = require('../config/config').host;

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

exports.exportProduct = {
    handler: function(request, reply) {
        json2csv({data: request.payload,  fields: ['productId', 'extProductId', 'tenantId', 'supplierId', 'statusId', 'mfgProductId', 'mfgProductName', 'manufacturerId', 'manufacturerName'], fieldNames: ['productId', 'extProductId', 'tenantId', 'supplierId', 'statusId', 'mfgProductId', 'mfgProductName', 'manufacturerId', 'manufacturerName']}, function(err, csv) {
          if (err) console.log(err);
          return reply(csv).header('Content-Type', 'application/octet-stream').header('content-disposition', 'attachment; filename=user.csv;');
        });
    }
};

exports.getProductById = {
    handler: function(request, reply) {
        Product.getProductById(request.params.id, function(err, result) {
            if (!err) {
                if (result.documents.length > 0) {
                    async.each(result.documents, function(file, callback) {
                        if (file.path !== undefined) {
                            var logo = file.path;
                            var imag_ext = logo.slice(logo.lastIndexOf('.')).slice(1);
                            var re = 'data:image/' + imag_ext + ';base64,';
                            logo = __dirname + filePath.directory + filePath.subdirectory + '/' + logo;

                            fs.readFile(logo, function(err, show) {
                                if (err) {
                                    console.log(err);
                                    file.path = "image not found";
                                    callback();
                                } else {
                                    var base64Image = new Buffer(show, 'binary').toString('base64');
                                    base64Image = re + base64Image;
                                    file.path = base64Image;
                                    callback();
                                }
                            });
                        } else {
                            callback();
                        }

                    }, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            return reply(result);
                        }
                    });
                } else {
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

exports.getHostFromConfig = {
    handler: function(request, reply) {
        return reply(hostFromConfig.ModuleLinkup);
    }
};

 /**Helper function to delete empty array*/
var deleteEmptyArrayHelper = function(data) {
    var originalData = JSON.parse(JSON.stringify(data));
    for (var req in originalData) {
        if(Array.isArray(originalData[req]) && !originalData[req].length){
            originalData[req] = undefined;
        }        
    }
    return originalData;
};
