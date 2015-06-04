myApp.controller('ProductSearchCtrl', [ '$scope','$rootScope', 
	'$http','$location','growl','$modal','$routeParams','$filter',
	'blockUI','getProductData',
	function($scope,$rootScope, $http, $location,
		growl, $modal, $routeParams,$filter, blockUI,getProductData){


 		$scope.showeditor = function (id){
 			$location.path("/edit-product/" + id);
 		}
		

        $scope.maxSize = 5;
        

  		$scope.pageCount = function () {
  		  return Math.ceil($scope.tabledata.length / $scope.itemsPerPage);
  		};

  		$scope.reset_search =function(){
  			$scope.searchData = {};
  			//$scope.tabledatas = {};
  			$scope.tabledata = {};
  		}

		$scope.searchProduct = function (searchData) {
            getProductData.searchProduct(searchData)
            	.then(function (data) {
                    $scope.tabledatas=data.data;
                    $scope.totalItems = $scope.tabledatas.length;
                    $scope.itemsPerPage = 10;
  					$scope.currentPage = 1;
             	})
             	.catch(function(error){
             		console.log('error');
             	})

     	$scope.$watch('currentPage + itemsPerPage', function(){ 
     	if($scope.tabledatas){
     		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
    				end = begin + $scope.itemsPerPage;
    				      $scope.tabledata = $scope.tabledatas.slice(begin, end);
     	}            
                
        });
        
    }


	$scope.updateitem = function(editproduct){


			$http.put('/updateProduct/'+editproduct._id ,editproduct)
			.success(function (data,status){
				console.log(data);
			});

		}



// filtering


	$scope.sortType     = 'name'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order
  	$scope.search  = '';     // set the default search/filter term


//export csv file of selected product

$scope.exportProduct = function(searchdata){
		searchdata=$filter('filter')(searchdata, function(value){
			if(value.checked==true){
				return true;
			}
			else{
				return false;
			}
		})
		$http.post('/exportProduct',searchdata).
		    success(function(data, status, headers, config) {
		     var element = angular.element('<a/>');
		     element.attr({
		         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
		         target: '_blank',
		         download: 'product.csv'
		     })[0].click();
		   }).
			error(function(data, status, headers, config) {
			   
			});
	
}

}]);




