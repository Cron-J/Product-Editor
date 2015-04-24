myApp.controller('ProductSearchCtrl', [ '$scope','$rootScope', 
	'$http','$location','growl','$modal','$routeParams','$filter',
	'blockUI','getProductData',
	function($scope,$rootScope, $http, $location,
		growl, $modal, $routeParams,$filter, blockUI,getProductData){

		// $scope.tempvar =true;


		// $scope.showhide = function (){

		//  $scope.tempvar =false;
		// }

 		$scope.showeditor = function (id){
 			$location.path("/edit-product/" + id);
 		}
		


		// $scope.showvariants = function (id){
 	// 		$location.path("/product-variant/" + id);
 	// 	}





        $scope.maxSize = 5;
        

  		$scope.pageCount = function () {
  		  return Math.ceil($scope.tabledata.length / $scope.itemsPerPage);
  		};

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


    // $scope.getproduct = function(id){

    // 	getProductDataFactory.getProduct(id);

	   // $http.get('/getProduct/' + id)
	   // .success(function (status,data){

				// 	console.log(data);
				// 	$location.path('/edit-product');
				// });

	    	
	   //  }

	$scope.updateitem = function(editproduct){


			$http.put('/updateProduct/'+editproduct._id ,editproduct)
			.success(function (data,status){
				console.log(data);
			});

		}


		// $scope.fetchProductData = function(){

		// 	$scope.editproduct = getProductDataFactory.getlocalData();
			
		// }




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




  //       $scope.range = function (start, end) {
		// 	var ret = [];
		// 	if (!end) {
		// 		end = start;
		// 		start = 0;
		// 	}
		// 	for (var i = start; i < end; i++) {
		// 		ret.push(i);
		// 	}
		// 	return ret;
		// };

		// $scope.prevPage = function () {
		// 	if ($scope.currentPage > 0) {
		// 		$scope.currentPage--;
		// 	}
		// 	if($scope.min > 0){ 
		// 		$scope.min--;
		// 	}
		// 	if($scope.max > 5){ 
		// 		$scope.max--;
		// 	}
		// };

		// $scope.nextPage = function () {
		// 	if ($scope.currentPage < $scope.pagedItems.length - 1) {
		// 		$scope.currentPage++;
		// 	}
		// 	$scope.limit = $scope.pagedItems.length;
		// 	if($scope.min < $scope.limit && $scope.min <= $scope.limit - 6) {
		// 		$scope.min++;
		// 	}
		// 	if($scope.max < $scope.limit && $scope.min <= $scope.limit) {
		// 		$scope.max++;
		// 	}
		// };

		// $scope.setPage = function () {
		// 	$scope.currentPage = this.n;
		// };

		// $scope.groupToPages = function () {
		// 	$scope.pagedItems = [];
		// 	$scope.filteredItems = $scope.searchResult;
		// 	$scope.filtered();
		// };


// myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
// 	$scope.ok = function () {
// 		$scope.item = 'yes';
// 		$modalInstance.close($scope.item);
// 	};

// 	$scope.cancel = function () {
// 		$modalInstance.dismiss('cancel');
// 	};
// });


