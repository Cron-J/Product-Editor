'use strict';

// dependencies
var mongoose = require('../config/db').Mongoose,
    Schema = mongoose.Schema,
    constants = require('../Utility/constants').constants,
    validator = require('mongoose-validators'),
    Product2ClassificationGroup = require('./product-classification-group').Product2ClassificationGroup,
    ProductAttributeValue = require('./product-attribute-value').ProductAttributeValue,
    Price = require('./price').Price,
    ContractedProduct = require('./contracted-product').ContractedProduct,
    ProductRelation = require('./product-relation').ProductRelation,
    ProductDocAssociation = require('./product-doc-association').ProductDocAssociation,
    Variant = require('./variant').Variant;

/**
 * <p>Common Product with primitive types for fields and collections of ProductRelations, ContractedProducts, Prices, Product2ClassificationGroups, ProductAttributeValues and ProductDocAssociation
 *
 * <p>Products belong to the most important items of the catalog application.
 * A product is an item that is presented, or offered, or purchased via the catalog.
 * Basic information and properties of a product are maintained as fields with primitive type
 * Advanced and detailed information, such as an arbitrary number of prices, product
 * descriptions in different languages, and related documents are maintained in separate classes.</p>
 *
 */
var ProductSchema = new Schema({
    /**
     * Identifier of Product's Tenant this product is listed in.
     */
    tenantId: {
        type: String,
        index: true,
        required: true,
        validate: [ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     *  Identifier inside the product catalog. Together with catalogId this is globally unique.
     */
    productId: {
        type: String,
        unique: true,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Identifier of the Supplier who own the product.
     */
    supplierId: {
        type: String,
        index: true,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Identifier of product status (like <i>800 - deleted</i>, <i>400 - confirmed</i>, etc).
     */
    statusId: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Manufacturer article identifier.
     */
    mfgProductId: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Manufacturer article name. (WARN: in PIM this is same fields means <code>manufacturerName</code> because <code>mfgProductName</code> doesn't exist in PIM)
     */
    mfgProductName: {
        type: String,
        validate:[ validator.matches(constants.nameRegex), validator.isLength(0, 50) ]
    },

    /**
     * Identifier of Manufacturer of the product.
     */
    manufacturerId: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * The name of the manufacturer of the product. (WARN: in PIM the same fields means <code>mfgProductName</code> because <code>mfgProductName</code> doesn't exist in PIM)
     */
    manufacturerName: {
        type: String,
        validate:[ validator.matches(constants.nameRegex), validator.isLength(0, 50) ]
    },

    /**
     *  External product ID. Useful when external products are mapped to jCatalog using a different set of ids.
     */
    extProductId: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     *  Extension to {@link #productId}. Useful in scope of Master/Variants scenarios to store the variant's Id suffix.
     */
    productIdExtension: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Identifier of additional UOM for BMECat CONTENT_UNIT.
     */
    unitOfMeasureId: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Identifier of UOM to be used for this product when ordered. This is also the unit the price is related to.
     */
    salesUnitOfMeasureId: {
        type: String,
        validate:[ validator.matches(constants.idRegex), validator.isLength(0, 50) ]
    },

    /**
     * Keywords that are used for searching products, separated by white space.
     */
    keywords: {
        type: String,
        validate:[ validator.matches(constants.nameRegex), validator.isLength(0, 50) ]
    },

    /**
     * EAN/GTIN  internationally unique article number
     */
    ean: {
        type: String,
        validate:[ validator.matches(constants.nameRegex), validator.isLength(0, 50) ]
    },

    /**
     * Defines does product belong to the core assortment for a particular customer.
     */
    isMainProdLine: {
        type: Boolean
    },

    /**
     * Defines is product for sale.
     */
    isForSales: {
        type: Boolean
    },

    /**
     * Defines is product available only in context of special offer
     */
    isSpecialOffer: {
        type: Boolean
    },

    /**
     * Defines is product in stock
     */
    isStocked: {
        type: Boolean
    },

    /**
     * Identification of punchout product. If true this will allow to jump
     * to external catalogs instead direct add to cart in OPC. Requires
     * punchout configuration via script exit.
     */
    isPunchout: {
        type: Boolean
    },

    /**
     * Flags a product as configurable with PSC.
     */
    isConfigurable: {
        type: Boolean
    },

    /**
     * Product valid range from.
     */
    validFrom: {
        type: Date
    },

    /**
     * Product valid range to.
     */
    validTo: {
        type: Date
    },

    /**
     * User name who has created the Product.
     */
    createdBy: {
        type: String
    },

    /**
     * User name who has changed the Product last time.
     */
    updatedBy: {
        type: String
    },

    /**
     * Product creation timestamp.
     */
    createdAt: {
        type: Date
    },

    /**
     * Product updation timestamp.
     */
    updatedAt: {
        type: Date
    },


    /**
     * Set of {@link Product2ClassificationGroup}s.
     */
    classificationGroupAssociations: [Product2ClassificationGroup],

    /**
     * Set of {@link ProductAttributeValue}s.
     */
    attributeValues: [ProductAttributeValue],

    /**
     * Set of {@link ContractedProduct}s. {@link ContractedProduct} links the product to a contract as part of it's assortment.
     */
    contractedProducts: [ContractedProduct],

    /**
     * Set of {@link Price}s.
     */
    prices: [Price],

    /**
     * Set of {@link ProductRelation}s.
     */
    productRelations: [ProductRelation],

    /**
     * Set of {@link ProductDocAssociation}s.
     */
    documents: [ProductDocAssociation],

    /**
     * Set of {@link Variant}s.
     */
    variants: [Variant]

});

ProductSchema.pre('save', function(next) {
    if (this.variants && 0 === this.variants.length) {
        this.variants = undefined;
    }
    if (this.classificationGroupAssociations && 0 === this.classificationGroupAssociations.length) {
        this.classificationGroupAssociations = undefined;
    }
    if (this.attributeValues && 0 === this.attributeValues.length) {
        this.attributeValues = undefined;
    }
    if (this.contractedProducts && 0 === this.contractedProducts.length) {
        this.contractedProducts = undefined;
    }
    if (this.prices && 0 === this.prices.length) {
        this.prices = undefined;
    }
    if (this.productRelations && 0 === this.productRelations.length) {
        this.productRelations = undefined;
    }
    if (this.documents && 0 === this.documents.length) {
        this.documents = undefined;
    }
    
    next();
});


ProductSchema.statics.createProduct = function(product, callback) {
    product.createdAt = new Date();
    product.updatedAt = new Date();
    this.create(product, callback);
};

ProductSchema.statics.searchProduct = function(query, callback) {
    this.find(query, callback);
};

ProductSchema.statics.getProductById = function(id, callback) {
    this.findOne({
        '_id': id
    }, callback);
};

ProductSchema.statics.updateProduct = function(id, product, callback) {
    if( product.createdAt ) { delete product.createdAt; }
    product.updatedAt = new Date();
    this.update({
        '_id': id
    }, product, callback);
};

// export
var product = mongoose.model('product', ProductSchema);

/** export schema */
module.exports = {
    Product: product
};