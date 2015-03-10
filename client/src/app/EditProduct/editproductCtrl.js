myApp.controller('EditProductCtrl', [ '$scope','$rootScope', 
	'$http','$location','growl','$modal','$routeParams','$filter',
	'blockUI',
	function($scope,$rootScope, $http, $location,
		growl, $modal, $routeParams, blockUI,$filter){


		$scope.updateitem = function(editproduct){


			$http.put('/updateProduct/'+editproduct._id ,editproduct)
			.success(function (status,data){
				console.log(data);
			});

		}

		$scope.cancel = function(){
			$location.path('/');
		}

		 var init = function(){
		 	var urlBase = '/getProduct/';
		 	$http.get(urlBase + $routeParams.id)
			  .then(function(result) {
			    $scope.editproduct = result.data;
			    
				})
			  .catch(function(err){
			  	console.log('error')
			  })
		 }


		 init();

		// $scope.fetchProductData = function(){

		// 	$scope.editproduct = getProductDataFactory.getlocalData();
			
		// }

		$scope.date = {startDate: null, endDate: null};

		$scope.opened = {};
 
		  $scope.open = function($event) {
		    
		        $event.preventDefault();
		        $event.stopPropagation();

		        $scope.opened = {};
		        $scope.opened[$event.target.id] = true;
		  };
		  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  $scope.format = $scope.formats[0];





		  $scope.showvar=false;

		  $scope.assignGrp = function (){
		  	$scope.showvar=true;
		  	$scope.editvar=false;
		  }





		  $scope.editvar=false;

		  $scope.editGrp = function (index){
		  	$scope.editrow=$scope.editproduct.classificationGroupAssociations[index];
		  	$scope.editvar=true;
		  	$scope.showvar=false;
		  }





		$scope.newClsfnidGrp = function (createNewGrp){ 
	    	$scope.editproduct.classificationGroupAssociations.push(createNewGrp);
	    	$scope.updateitem($scope.editproduct);
	    	console.log($scope.editproduct);
		}


		// check Uncheck check boxes


		$scope.isAll = false;	

		$scope.selectAllcBoxes = function() {
        
            if($scope.isAll === false) {
    		angular.forEach($scope.boxes, function(box){
             	box.checked = true;
    		});
	        $scope.isAll = true;	
	        } else {
	        angular.forEach($scope.boxes, function(box){
	             	box.checked = false;
	    		});
	        $scope.isAll = false;	
        }
}

        $scope.selectedcBoxes = function () {

        return $filter('filter')($scope.boxes, {checked: true});

      	};



// Attribute Section

	// $scope.editedItem = null;
    
 //    $scope.editing = false;

 //    $scope.newItem = function(){ 
 //        $scope.items.push({name:"new record"});
    
 //    }

 //    $scope.startEditing = function(item){
 //        $scope.editing=true;
 //        $scope.editedItem = item;
 //    }
        
 //    $scope.doneEditing = function(item){
 //        $scope.editing=false;
 //        $scope.editedItem = null;

 //    }









}]);