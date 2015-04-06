// Load modules

var Product = require('./controller/product'),
	Variant = require('./controller/variant'),
    Static    = require('./static');

// API Server Endpoints
exports.endpoints = [
    { method: 'GET',  path: '/{somethingss*}', config: Static.get },
    { method: 'POST', path: '/createProduct', config: Product.createProduct },
    { method: 'POST', path: '/searchProduct', config: Product.searchProduct },
    { method: 'GET', path: '/getProduct/{id}', config: Product.getProductById },
    { method: 'PUT', path: '/updateProduct/{id}', config: Product.updateProduct },
    { method: 'POST', path: '/createVariant', config: Variant.createVariant },
    { method: 'GET', path: '/getVariants', config: Variant.getVariants },
    { method: 'PUT', path: '/updateVariant/{id}', config: Variant.updateVariant }
];

