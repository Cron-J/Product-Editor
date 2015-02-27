// Load modules

var Product = require('./controller/product'),
	Product2ClassificationGroup = require('./controller/product-classification-group'),
    Static    = require('./static');

// API Server Endpoints
exports.endpoints = [

    { method: 'GET',  path: '/{somethingss*}', config: Static.get },
    { method: 'POST', path: '/createProduct', config: Product.createProduct },
    { method: 'POST', path: '/createProductClassificationGroup', config: Product2ClassificationGroup.createProduct2ClassificationGroup },
    { method: 'POST', path: '/searchProduct', config: Product.searchProduct }
];