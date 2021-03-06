
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

     product.getConfig = function () {
        return $http.get('/getConfig');
    }

    product.getAttribute=function(url,searchdata){
        searchdata=searchdata ? searchdata: "";
        return $http.post(url+'/api/attributeSearch',{sectionRef: searchdata});
    }

    product.createChannel=function(data){
        return $http.post('/createChannel',data);
    }

    product.getChannels=function(tenantId){
        return $http.get('/getChannel/'+tenantId);
    }

    product.setSearchedData = function(data) {
        product.searchedData = data;
    }

    product.getSearchedData = function() {
        return product.searchedData;
    }
    

    
    return product;

}]);



