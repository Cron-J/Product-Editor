myApp.controller('classificationSearchCtrl', [ '$scope', '$http','$location','classification',
	'growl','$modal','$routeParams', 'tenant','blockUI',
	function($scope, $http, $location, classification, growl, $modal, 
		$routeParams, tenant, blockUI){

		$scope.master = {};
		$scope.changeView.classificationShow=false;
		$scope.obj={id:""};
		$scope.typeList = [{
												"id":1, "code":'UNSPC'
											},
											{
												"id":2, "code":'eClass'
											},
											{
												"id":3, "code":'Proprietary'
											}];

		$scope.edit_classification = function(id){
			$scope.changeView.classificationShow=true;
			$scope.obj.id=id;
			$scope.page = 'edit';
		};

		$scope.new_page = function(){
			$scope.changeView.classificationShow=true;
			$scope.page = 'new';
		};

		$scope.searchTenant = function () {
			$scope.setTenantsList = false;
			$scope.searchVar.value = false;
			$('#tenantSearchModal').modal('show');
		}

		$scope.setTenantList = function () {
			$scope.searchVar.value = true;
			$scope.setTenantsList = true;
		}
		$scope.getTenantDetails = function (result) {
			$scope.searchQuery.tenantRef = {};
			$scope.searchQuery.tenantRef._id = result._id;
			$scope.searchQuery.tenantRef.name = result.name;
			if(result.description != undefined){
				$scope.searchQuery.tenantRef.comma = ', ';
				$scope.searchQuery.tenantRef.desc = null;
				$scope.searchQuery.tenantRef.desc = 
				result.description;
			}
			$scope.setTenantVar = true;
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

		$scope.reset_search = function() {
			for (var i = 0; i < $scope.typeList.length; i++) {
				$scope.typeList[i].ticked = false;
			};
			$scope.searchQuery = angular.copy($scope.master);
		};

		$scope.search = function(){
			// Block the user interface
    	blockUI.start();
			if($scope.setTenantVar == true){
				if($scope.searchQuery.tenantRef != undefined){ 
					if($scope.searchQuery.tenantRef.desc != undefined){
						var description = $scope.searchQuery.tenantRef.desc;
						var commaSymbol = $scope.searchQuery.tenantRef.comma;
					}
					if($scope.searchQuery.tenantRef.name != undefined){
						var id = $scope.searchQuery.tenantRef._id;
						var name = $scope.searchQuery.tenantRef.name;
						$scope.searchQuery.tenantRef = name;
					}
				}	
			}
			var rqstData = customTransform();
			if($scope.setTenantVar == true){
				if(name != undefined){
					$scope.searchQuery.tenantRef = {};
					$scope.searchQuery.tenantRef.name = name;
					$scope.searchQuery.tenantRef._id = id;
				}
				if(description != undefined){
					$scope.searchQuery.tenantRef.desc = description;
					$scope.searchQuery.tenantRef.comma = commaSymbol;
				}
			}
			$scope.setTenantVar = false;
			for (var i = 0; i < rqstData.length; i++) {
				if(rqstData[i].key == "type"){
					rqstData[i].value = rqstData[i].value[0].code;
				}
			}
			classification.searchQuery({url:'classificationSearch'},rqstData).$promise.then(function(data){
				$scope.searchResult = data;
				$scope.currentPage = 0;
				$scope.groupToPages();
				// Unblock the user interface
      	blockUI.stop();	
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			});
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

		$scope.groupTenantPages = function () {
			$scope.pagedItems = [];
			$scope.filteredItems = $scope.searchTenantResult;
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

		$scope.list_section = function(){
			tenant.query({url:'tenants'}).$promise.then(function(data){
				$scope.tenantList = data;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			})
		};

		function customTransform(){
			var temp = [];
			for(key in $scope.searchQuery){
				switch(key){
					case 'classificationId':
					case 'descShort':
					case 'descLong':
					case 'versionNo':
					case 'type':
					case 'tenantRef' :
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

		function customTenantTransform(){
			var temp = [];
			for(key in $scope.searchTenantQuery){
				switch(key){
					case 'name':
					case 'description':
				if($scope.searchQuery[key]!=""){
					temp.push({
						"key": key,
						"value": $scope.searchTenantQuery[key]
					})						
				}
				}
			}
			return temp;
		}

		$scope.list_section = function(){
			tenant.query({url:'tenants'}).$promise.then(function(data){
				$scope.tenantList = data;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			})
		};

		$scope.pagedItems = [];
		$scope.currentPage = 0;
		$scope.filteredItems = [];
	 	$scope.itemsPerPage = 5;
	 	$scope.min = 0;
	 	$scope.max =5;
		$scope.groupToPages();
		$scope.list_section();
}]);

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
	$scope.ok = function () {
		$scope.item = 'yes';
		$modalInstance.close($scope.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});