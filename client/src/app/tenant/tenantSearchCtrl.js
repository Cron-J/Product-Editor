myApp.controller('tenantSearchCtrl', [ '$scope', '$http','$location','classification',
	'growl','$modal','$routeParams', 'tenant',
	function($scope, $http, $location, classification, growl, $modal, $routeParams, tenant){

		$scope.searchTenant = function () {
			$scope.setTenantsList = false;
			$scope.searchVar.value = false;
			$('#tenantSearchModal').modal('show');
		}

		$scope.setTenantList = function () {
			$scope.searchVar.value = true;
			$scope.setTenantsList = true;
		}

		$scope.searchTenantList = function ($viewValue) {
			$scope.setTenantVar = true;
			var temp = [];
			var obj = {};
			obj['key'] = "name";
   		obj['value'] = $viewValue;
			temp.push(obj);
			return tenant.searchQuery({url:'tenantSearch'},temp).$promise.then(function(data){
				var tenantList = [];
	      angular.forEach(data, function(item){     
	        if(item.description != undefined && 
	        	item.description != ""){
	        	tenantList.push({ "name": item.name, "_id": item._id, 
	        	"desc":item.description, "comma": ', ' });
	        } else {
	        	tenantList.push({ "name": item.name, "_id": item._id });
	        }
	      });
	      return tenantList;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			});
		}

		$scope.searchTenantDetails = function () {
			var rqstData = customTenantTransform();
			tenant.searchQuery({url:'tenantSearch'},rqstData).$promise.then(function(data){
				$scope.searchResult = data;
				$scope.currentPage = 0;
				$scope.groupToPages();
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			});
		}

		$scope.reset_search = function() {
			for (var i = 0; i < $scope.typeList.length; i++) {
				$scope.typeList[i].ticked = false;
			};
			$scope.searchQuery = angular.copy($scope.master);
		};
		
		$scope.range = function (start, end) {
			var ret = [];
			if (!end) {
				end = start;
				start = 0;
			}
			for (var i = start; i < end; i++) {
				ret.push(i);
			}
			return ret;
		};

		$scope.prevPage = function () {
			if ($scope.currentPage > 0) {
				$scope.currentPage--;
			}
			if($scope.min > 0){ 
				$scope.min--;
			}
			if($scope.max > 5){ 
				$scope.max--;
			}
		};

		$scope.nextPage = function () {
			if ($scope.currentPage < $scope.pagedItems.length - 1) {
				$scope.currentPage++;
			}
			$scope.limit = $scope.pagedItems.length;
			if($scope.min < $scope.limit && $scope.min <= $scope.limit - 6) {
				$scope.min++;
			}
			if($scope.max < $scope.limit && $scope.min <= $scope.limit) {
				$scope.max++;
			}
		};

		$scope.setPage = function () {
			$scope.currentPage = this.n;
		};

		$scope.groupToPages = function () {
			$scope.pagedItems = [];
			$scope.filteredItems = $scope.searchResult;
			$scope.filtered();
		};

		$scope.filtered = function () {
			if($scope.filteredItems){
				for (var i = 0; i < $scope.filteredItems.length; i++) {
					if (i % $scope.itemsPerPage === 0) {
						$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
					}
					else {
						$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
					}
				}
			}   
		};

		$scope.delete_one = function(id,index){
			var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
			});
			modalInstance.result.then(function (selectedItem) {
			classification.delet({url:'classification',classification_id:id}).$promise.then(function(data){
				$scope.searchResult.splice(index,1);
				$scope.filtered();
				growl.addSuccessMessage('Classification removed Succesfully');
			}).catch(function(error){
				growl.addErrorMessage("oops! Something went wrong");
			})
			});
		};

		function customTenantTransform(){
			var temp = [];
			for(key in $scope.searchQuery){
				switch(key){
					case 'name':
					case 'description':
				if($scope.searchQuery[key]!=""){
					temp.push({
						"key": key,
						"value": $scope.searchQuery[key]
					})						
				}
				}
			}
			return temp;
		}

		$scope.pagedItems = [];
		$scope.currentPage = 0;
		$scope.filteredItems = [];
	 	$scope.itemsPerPage = 5;
	 	$scope.min = 0;
	 	$scope.max =5;
		$scope.groupToPages();
}]);
