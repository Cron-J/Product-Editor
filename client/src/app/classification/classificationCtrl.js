myApp.controller('classificationCtrl', [ '$scope', '$rootScope','$http',
	'$routeParams','$location','classification','tenant','growl','$modal',
	'$timeout',
	function($scope, $rootScope, $http, $routeParams, $location, 
		classification, tenant, growl, $modal, $timeout){
		$scope.changeView.classificationGroupShow=false;

		$scope.languageList = [{"name":'German', "iso":'de'},
													 {"name":'English', "iso":'en'}
													];

		$scope.master = {
			// $scope.attributeSection.timestamp.createdBy = 'jcadmin';
			// $scope.attributeSection.timestamp.updatedBy = 'jcadmin';
		};

		$scope.init_page = function () {
			$scope.classification.descriptions = {};
			$scope.classification.orderNo = 0;
			$scope.classification.descriptions.descShort = [{"language":'en', "description":null}];
			$scope.classification.descriptions.descLong = [{"language":'en', "description":null}];
			$timeout(function () {
	      $scope.classification.orderNo = null;
	    });
		}

		/****************** Dialog Boxes Handlers *****************/
		
		$scope.closeModal = function () {
			$('#classificationConfirmationDailogBox').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		} 

		$scope.isRedirectConformed = function(){
			$scope.closeModal();
			$scope.cancel_view();
		}
	/******************************************************/
		
		$scope.searchTenantName = function () {
			$scope.setTenantsList = false;
			$scope.searchVar.value = false;
			$('#tenantNameSearchModal').modal('show');
		}

		$scope.getTenantInfo = function (result) {
			$scope.classification.tenantRef = {};
			$scope.classification.tenantRef._id = result._id;
			$scope.classification.tenantRef.name = result.name;
			if(result.description != undefined){
				$scope.classification.tenantRef.comma = ', ';
				$scope.classification.tenantRef.desc = null;
				$scope.classification.tenantRef.desc = 
				result.description;
			}
			$scope.setTenantVar = true;
		}

		/* Adding multiple short and long descriptions */
		$scope.add_desc = function (list) {	
			list.length++;
			for(var i=0; i < list.length; i++){
				k= list.length-1;
				if(i == k){
					if(list[k-1].description != null && 
						list[k-1].description != "" && 
						i <	$scope.languageList.length){
						list[i] = {"language":'de', "description": null};
					} else {
						list.length--;
						if(list.length ==	$scope.languageList.length)
							growl.addWarnMessage('You are not allowed to add more than limit');
					}
				}
			}		
			$scope.checkLanguage(list);
		}

		$scope.remove_desc =function (list, index) {
			if(list.length == 1){
				list[0] = {"language":'en', "description": null};
			} else {
				list.splice(index, 1);
			}
		}

		$scope.delete_desc = function (list, index) {
			if(list.length != 1){
				if(list[index].description == "")
					list.splice(index, 1);
			}
		}

		$scope.changeLanguage = function (list, id) {
			for(var i = 0; i < list.length ; i++){
				if(list[i].description != "" && list[i].description != null && id == i){
					growl.addWarnMessage('You have changed the language please check description');
				}
			}
			$scope.checkLanguage(list);
		}
		$scope.checkLanguage = function (list) {
			if(list.length == $scope.languageList.length) {
				for(var i = 0; i < list.length ; i++){
					if(list[0].language == 
						list[1].language){
						growl.addWarnMessage('You have selected same language more than once');
					}
				}
			}
		}

		/*----------------------------*/
  	$scope.refactorData = function (classification_details) {
  		for(var i=0; i<classification_details.descriptions.descShort.length; i++) {
				if(classification_details.descriptions.descShort[i].description == null
					|| classification_details.descriptions.descShort[i].description == "") {
					if(classification_details.descriptions.descShort.length == 1){
						classification_details.descriptions.descShort[i] = {"language":'en', "description": ''};
					} else {
						$scope.remove_sd(classification_details.descriptions.descShort, i);
					}
				}
			}
			for(var i=0; i<classification_details.descriptions.descLong.length; i++) {
				if(classification_details.descriptions.descLong[i].description == null
					|| classification_details.descriptions.descLong[i].description == "") {
					if(classification_details.descriptions.descLong.length == 1){
						classification_details.descriptions.descLong[i] = {"language":'en', "description": ''};
					} else {
						$scope.remove_ld(classification_details.descriptions.descLong, i);
					}
				}
			}
	  }
		
		$scope.submit = function(classification_details){
			if(classification_details.tenantRef != undefined){
				if(classification_details.tenantRef.name != undefined){
					$scope.tName = classification_details.tenantRef.name;
					var tenRef = classification_details.tenantRef;
				}
			} else {
				$scope.tName = classification_details.tenantRef;
			}
			tenant.get({url:'tenantOne',id:$scope.tName}).$promise.then(function(data){
				if(data.exist == 'false'){
					growl.addErrorMessage('Tenant is not existed, please select valid tenant');
				} else {
					classification_details.tenantRef = data._id;
					if($scope.classificationForm.$valid){
						$scope.refactorData(classification_details);
						getObject(classification_details);
						
						classification.save({url:'classification'}, classification_details).$promise.then(function(data){
						$scope.classification = data;
						if(data.statusCode != 403){
							growl.addSuccessMessage('Classification created succesfully');
							$scope.classification_view(data._id);
						} else {
							growl.addErrorMessage(data.message);
							$scope.classification = classification_details;
							$scope.classification.tenantRef = {};
							$scope.classification.tenantRef = tenRef;
						}
						}).catch(function(error){
							growl.addErrorMessage('Oops! Something went wrong');
						});
					}
					else{
						var modalInstance = $modal.open({
						templateUrl: 'alert.html',
						controller: 'ModalInstanceCtrl',
						});
					}
				}
			}).catch(function(error){
				growl.addErrorMessage('Oops! Something went wrong');
			})
		};

		$scope.reset = function() {
			$scope.classification = angular.copy($scope.master);
			$scope.init_page();
		};

		$scope.edit_classification = function(id){
			$scope.changeView.classificationShow=true;
			$scope.obj.id=id;
			$scope.page = 'edit';
			view_classification();
		};

		$scope.classification_view = function(id)
		{
			$scope.changeView.classificationShow=true;
			$scope.obj.id=id;
			$scope.page = 'view';
			view_classification();
		};

		$scope.cancel_view = function(){
			$scope.changeView.classificationShow=false;
		};

		$scope.list_section = function(){
			tenant.query({url:'tenants'}).$promise.then(function(data){
				$scope.tenantList = data;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			})
		};
		
		$scope.view_page = function(){
			if($scope.page == 'new'){
				$scope.page = 'new';
			}
			else if($scope.page == 'edit'){
				$scope.page = 'edit';
				view_classification();
			}
			else{
				$scope.page = 'view';
				view_classification();
			}
		};

		$scope.update_classification = function(classification_details,id){
			if(classification_details.tenantRef.name != undefined){
				$scope.tName = classification_details.tenantRef.name;
			} else {
				$scope.tName = classification_details.tenantRef;
			}
			tenant.get({url:'tenantOne',id:$scope.tName}).$promise.then(function(data){
				if(data.exist == 'false'){
					growl.addErrorMessage('Tenant is not existed, please select valid tenant');
				} else {
					classification_details.tenantRef = data._id;
					if($scope.classificationForm.$valid){
						$scope.refactorData(classification_details);
						getObject(classification_details);
						classification.update({url:'classification',classification_id:id},classification_details).$promise.then(function(data){
							growl.addSuccessMessage('Classification updated succesfully');
							$scope.classification_view(id);
						}).catch(function(error){
							growl.addErrorMessage('oops! Something went wrong');
						})
					}
					else{
						var modalInstance = $modal.open({
						templateUrl: 'alert.html',
						controller: 'ModalInstanceCtrl',
						});
					}
				}
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			})
	};

	$scope.reset();
	$scope.view_page();
	$scope.list_section();

	function view_classification(){
		classification.get({url:'classification',classification_id: $scope.obj.id }).$promise.then(function(data){
			$scope.classification = data;
			$scope.valueDetails = $scope.classification.timestamp;
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		})
	}
	function getObject(theObject) {
		var result = null;	
		for(var prop in theObject) {
			if(theObject[prop]===""){
				delete theObject[prop];
			}
			if(theObject[prop] instanceof Object)
				result = getObject(theObject[prop]);
		}
	};
	$scope.classificationGroup_page = function(id, result){
		$rootScope.classification_id = id;
		$rootScope.classificationId = result;
		$scope.changeView.classificationGroupShow=true;
	};
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