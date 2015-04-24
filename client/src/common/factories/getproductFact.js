
myApp.factory('getProductData', ['$http','$location',function($http,$location){
    var product={};
    var urlBase = '/getProduct/';

    product.getVariantAttrList = function () {
       return $http.post('/getVariants',{hasVariantAttributeValues:true})
    };

    product.getProducts=function (id){
        return $http.get(urlBase + id);
    };

    product.updateProduct=function (editproduct){
    	var product=angular.copy(editproduct)
        delete product._id;
    	return $http.put('/updateProduct/' + editproduct._id, product)
    }

    product.searchVariant=function(variantdata){
        return $http.post('/getVariants',variantdata);
    }
    product.searchProduct = function (searchData) {
        return $http.post('/searchProduct', searchData);
    }

    
    return product;

}]);



