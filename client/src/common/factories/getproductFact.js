
myApp.factory('getProductData', ['$http','$location',function($http,$location){
    var product={};
    
    product.getVariantAttrList = function (id) {
       return $http.post('/getVariants',{hasVariantAttributeValues:true})
    };
    
    return product;

}]);



