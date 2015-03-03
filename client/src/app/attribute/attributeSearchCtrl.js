myApp.controller('attributeSearchCtrl', [ '$scope', '$rootScope', '$http','$location','attribute','attributeSection',
	'growl','$modal','$routeParams', 'blockUI',
	function($scope, $rootScope, $http, $location, attribute, attributeSection, 
		growl, $modal, $routeParams, blockUI){
		$scope.master = {};
		$scope.changeView.attributeShow=false;
		
		$scope.obj={id:""};


		$scope.edit_attribute = function(id)
		{
			$scope.changeView.attributeShow=true;
			$scope.obj.id=id;
			$scope.page = 'edit';
		};
		if($location.search().mode=='edit'){
			$scope.edit_attribute($location.search().id);
			$location.search({});
		}

		$scope.new_page = function(){
			$scope.changeView.attributeShow=true;
			$scope.page = 'new';
		};

		$scope.check = function() {
			$scope.checked = true;
		}

		$scope.reset_search = function() {
			for (var i = 0; i < $scope.sectionList.length; i++) {
				$scope.sectionList[i].ticked = false;
			};
			$scope.searchQuery = angular.copy($scope.master);
		};

		$scope.searchSectionList = function($viewValue){
			$scope.setSectionVar = true;
			var temp = [];
			var obj = {};
			obj['key'] = "attributeSectionId";
   		obj['value'] = $viewValue;
			temp.push(obj);
			return attributeSection.searchQuery({url:'attributeSectionSearch'},temp).$promise.
			then(function(data){
				var sectionList = [];
	      angular.forEach(data, function(item){     
	        if(item.descriptions[0].description != undefined && 
	        	item.descriptions[0].description != "" && 
	        	item.descriptions[0].description != " "){
	        	sectionList.push({ "attributeSectionId": item.attributeSectionId, "_id": item._id, 
	        	"desc":item.descriptions[0].description, "comma": ', ' });
	        } else {
	        	sectionList.push({ "attributeSectionId": item.attributeSectionId, "_id": item._id });
	        }
	      });
	      return sectionList;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			});
		}

		$scope.searchsectionId = function () {
			$scope.setSectionsList = false;
			$scope.searchVar.value = false;
			$('#sectionSearchModal').modal('show');
		}
		$scope.setSectionList = function () {
			$scope.searchVar.value = true;
			$scope.setSectionsList = true;
		}
		$scope.getSectionDetails = function (result) {
			if($scope.searchQuery != undefined) {
				$scope.searchQuery.sectionRef = {};
			} else {
				$scope.searchQuery = {};
				$scope.searchQuery.sectionRef = {};
			}
			$scope.searchQuery.sectionRef._id = result._id;
			$scope.searchQuery.sectionRef.attributeSectionId = result.attributeSectionId;
			if(result.descriptions[0].description != undefined && 
				result.descriptions[0].description != " "){
				$scope.searchQuery.sectionRef.comma = ', ';
				$scope.searchQuery.sectionRef.desc = null;
				$scope.searchQuery.sectionRef.desc = 
				result.descriptions[0].description;
			}
			$scope.setSectionVar = true;
		}

		$scope.search = function(){
			// Block the user interface
    	blockUI.start();
			if($scope.setSectionVar == true){
				if($scope.searchQuery.sectionRef != undefined){ 
					if($scope.searchQuery.sectionRef.desc != undefined){
						var description = $scope.searchQuery.sectionRef.desc;
						var commaSymbol = $scope.searchQuery.sectionRef.comma;
					}
					if($scope.searchQuery.sectionRef.attributeSectionId != undefined){
						var attributeSectionId = $scope.searchQuery.sectionRef.attributeSectionId;
						var id = $scope.searchQuery.sectionRef._id;
						$scope.searchQuery.sectionRef = attributeSectionId;
					} 
				}	
			}
			var rqstData = customTransform();
				if($scope.setSectionVar == true){
					if(attributeSectionId != undefined){
						$scope.searchQuery.sectionRef = {};
						$scope.searchQuery.sectionRef.attributeSectionId = attributeSectionId;
						$scope.searchQuery.sectionRef._id = id;
					} 
					if(description != undefined){
						$scope.searchQuery.sectionRef.desc = description;
						$scope.searchQuery.sectionRef.comma = commaSymbol;
					}
				}
				$scope.setSectionVar = false;

			attribute.searchQuery({url:'attributeSearch'},rqstData).$promise.then(function(data){
				$scope.searchVar.value = true;
				$scope.searchResult = [];
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
			attribute.delet({url:'attribute',attribute_id:id}).$promise.then(function(data){
				if(data.statusCode !== 400){
					$scope.searchResult.splice(index,1);
					$scope.filtered();
					growl.addSuccessMessage('Attribute removed Succesfully');
				}
				else growl.addErrorMessage(data.message);
			}).catch(function(error){
				growl.addErrorMessage("oops! Something went wrong");
			})
			});
		};

		$scope.list_section = function(){
			attributeSection.query({url:'attributeSection'}).$promise.then(function(data){
				$scope.sectionList = data;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			})
		};

		function customTransform(){
			var temp = [];
			console.log();
			for(key in $scope.searchQuery){
				switch(key){
					case 'attributeId':
					case 'extAttributeId':
					case 'description':
					case 'sectionRef':
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