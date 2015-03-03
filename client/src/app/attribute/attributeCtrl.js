myApp.controller('attributeCtrl', [ '$scope', '$http', '$routeParams','$location','attribute', 'attributeSection',
 'growl','$modal', '$timeout',
	function($scope, $http, $routeParams, $location, attribute, 
		attributeSection, growl, $modal, $timeout){
		$scope.isFromCG = false;
	$scope.typesData = [ 
							{id: 1, typeName: "boolean"}, 
							{id: 2, typeName: "date"}, 
							{id: 3, typeName: "integer"},
							{id: 4, typeName: "numeric"},
							{id: 5, typeName: "string"},
							{id: 6, typeName: "text"},
							{id: 7, typeName: "document"},
							{id: 8, typeName: "email"},
							{id: 9, typeName: "reference"}
						];

	$scope.languageList = [{"name":'German', "iso":'de'},
												 {"name":'English', "iso":'en'}
												];
	$scope.typesDataDup = angular.copy($scope.typesData)

	$scope.init_page = function () {
		$scope.attribute = {};
		$scope.attribute.descriptions = {};
		$scope.attribute.descriptions.descShort = [{"language":'en', "description":null}];
		$scope.attribute.descriptions.descLong = [{"language":'en', "description":null}];
		$scope.unitOfMeasuresReset();
		$scope.typesReset();
	}

	$scope.resetOrderNo = function () {
		$scope.attribute.orderNo = 0;
		$timeout(function () {
      $scope.attribute.orderNo = null;
    }, 1);
	}
	$scope.typesReset = function () {
		if($scope.typesDataDup != undefined){
			for(var i=0; i< $scope.typesDataDup.length ; i++){
				$scope.typesDataDup[i].ticked = false;
			}
		}
	}
	$scope.unitOfMeasuresReset = function () {
		if($scope.unitOfMeasures != undefined){
			for(var i=0; i< $scope.unitOfMeasures.length ; i++){
				$scope.unitOfMeasures[i].ticked = false;
			}
		}
		$scope.attribute.unitOfMeasure = [];
	}
	$scope.resetMultivalued = function (valid) {
		if(valid == false){
			$scope.typesReset();
		}
	}

	/* Adding multiple descriptions and long descriptions */
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
			if(list[i].description != "" && list[i].description != null && id == i)
				growl.addWarnMessage('You have changed the language please check description');
		}
		$scope.checkLanguage(list);
	}

	$scope.checkLanguage = function (list) {
		if(list.length == $scope.languageList.length) {
			for(var i = 0; i < list.length ; i++){
				if(list[0].language == list[1].language)
					growl.addWarnMessage('You have selected same language more than once');				
			}
		}
	}
	/*---------------------------------*/


	$scope.refactorData = function (attribute_details) {
		for(var i=0; i<attribute_details.descriptions.descShort.length; i++) {
			if(attribute_details.descriptions.descShort[i].description == null
			|| attribute_details.descriptions.descShort[i].description == "") {
				if(attribute_details.descriptions.descShort.length == 1){
					attribute_details.descriptions.descShort[i] = {"language":'en', "description": ''};
				} else {
					$scope.remove_desc(attribute_details.descriptions.descShort, i);
				}
			}
		}
		for(var i=0; i<attribute_details.descriptions.descLong.length; i++) {
			if(attribute_details.descriptions.descLong[i].description == null
				|| attribute_details.descriptions.descLong[i].description == "") {
				if(attribute_details.descriptions.descLong.length == 1){
					attribute_details.descriptions.descLong[i] = {"language":'en', "description": ''};
				} else {
					$scope.remove_desc(attribute_details.descriptions.descLong, i);
				}
			}
		}
	}

	$scope.type = function () {
		var modalInstance = $modal.open({
			templateUrl: 'alert.html',
			controller: 'ModalInstanceCtrl',
		});
	}

	$scope.submit = function(attribute_details){
		var check;
		if(attribute_details.isRequired == true){
			if(attribute_details.valueOptions == undefined || 
				attribute_details.valueOptions == null){
				check = true;
			}else if(attribute_details.valueOptions.length < 1 ){
				check = true;
			} else {
				check = false;
			}
		} else {
			check = false;
		}
		if(check == false){
			if(attribute_details.sectionRef != undefined){
				if(attribute_details.sectionRef.attributeSectionId) {
					var secInfo = attribute_details.sectionRef;
					$scope.secId = attribute_details.sectionRef.attributeSectionId;
				}
				else
					$scope.secId = attribute_details.sectionRef;
			} 
			attributeSection.get({url:'attributeSectionOne',id:$scope.secId}).$promise.then(function(data){
				if(data.exist == "true" || $scope.secId == undefined){
					if($scope.attributeForm.$valid){	
						$scope.refactorData(attribute_details);
						getObject(attribute_details);
						if(attribute_details.valueOptions == undefined || attribute_details.valueOptions.length ==0) {
							delete attribute_details.valueOptions;
						}
						if(attribute_details.unitOfMeasure != undefined){
							if(attribute_details.unitOfMeasure.length > 0)
								attribute_details.unitOfMeasure = attribute_details.unitOfMeasure[0].name;
							else
								delete attribute_details.unitOfMeasure;
						} 
						
						if(data._id)
							attribute_details.sectionRef = data._id;
						else 
							delete attribute_details.sectionRef;
						attribute.save({url:'attribute'}, attribute_details).$promise.then(function(data){
							$scope.attribute = data;
							if(data.statusCode != 403){
								growl.addSuccessMessage('Attribute created succesfully');
							 	$scope.attribute_view(data._id);
							} else {
								growl.addErrorMessage(data.message);
								$scope.attribute = attribute_details;
								if(secInfo){
									$scope.attribute.sectionRef = secInfo;
								} else { 
									if($scope.secId){
										$scope.attribute.sectionRef = $scope.secId;
									}	
								}
							}
						}).catch(function(error){
							console.log('error here',error);
							growl.addErrorMessage('Oops! Something went wrong');
						});
					}
					else
					{
						var modalInstance = $modal.open({
						templateUrl: 'alert.html',
						controller: 'ModalInstanceCtrl',
						});
					}	
				} else {
					growl.addErrorMessage('Please enter valid section');
				}
			}).catch(function(error){
					growl.addErrorMessage('oops! Something went wrong');
			})
		} else {
			growl.addErrorMessage('Please add atleast one attribute value option');
		}
	};

	/****************** Dialog Boxes Handlers *****************/
		
		$scope.closeModal = function () {
			$('#confirmationDailogBox').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		} 

		$scope.isCreateSubGroup = function(confirm){
			$scope.redirectAttr = false;
			if(confirm == true){
				$scope.createSGPage = true;
				$scope.classificationGroup = cgDetails;
			} else {
				$scope.createSGPage = false;
			}
		}

		$scope.isConformed = function(){
			$scope.closeModal();
			$scope.cancel_view();
		}
/******************************************************/

	$scope.reset = function() {
		$scope.attribute = angular.copy($scope.master);
		$scope.init_page();
		$scope.resetOrderNo();
	};

	$scope.searchSection = function () {
		$scope.setSectionsList = false;
		$scope.searchVar.value = false;
		$('#sectionPopupModal').modal('show');
		$scope.reset_search();
	}
	$scope.setSectionList = function () {
		$scope.searchVar.value = true;
		$scope.setSectionsList = true;
	}
	$scope.getSectionInfo = function (result) {
			$scope.attribute.sectionRef = {};
			$scope.attribute.sectionRef._id = result._id;
			$scope.attribute.sectionRef.attributeSectionId = result.attributeSectionId;
			if(result.descriptions[0].description != undefined && 
				result.descriptions[0].description != " "){
				$scope.attribute.sectionRef.comma = ', ';
				$scope.attribute.sectionRef.desc = null;
				$scope.attribute.sectionRef.desc = 
				result.descriptions[0].description;
			}	
		}

	$scope.list_section = function(){
		attributeSection.query({url:'attributeSection'}).$promise.then(function(data){
			$scope.sectionList = data;
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		})
		attribute.get({url:'getStaticData'}).$promise.then(function(data){
			$scope.unitOfMeasures = data.measureList;
			$scope.currencyCode = data.currencyCode;
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		})
	};

	$scope.attribute_view = function(id)
	{
		$scope.changeView.attributeShow=true;
		$scope.obj.id=id;
		$scope.page = 'view';
		view_attribute();
	};

	$scope.cancel_view = function(){
		$scope.changeView.attributeShow=false;
		if($scope.isFromCG == true){
			$location.path('/attributes');
		}
		$scope.isFromCG = false;
	};

	$scope.edit_attribute = function(id){
		$scope.changeView.attributeShow=true;
		$scope.obj.id=id;
		$scope.page = 'edit';
		view_attribute();
	};
	$scope.view_page = function(){
		if($scope.page == 'new'){
			$scope.page = 'new';
		}
		else if($scope.page == 'view'){
			$scope.page = 'view';
			view_attribute();
		}
		else{
			$scope.page = 'edit';
			view_attribute();
		}
	};

	$scope.update_attribute = function(attribute_details,id){
		var check;
		if(attribute_details.isRequired == true){
			if(attribute_details.valueOptions == undefined || 
				attribute_details.valueOptions == null){
				check = true;
			}else if(attribute_details.valueOptions.length < 1 ){
				check = true;
			} else {
				check = false;
			}
		} else {
			check = false;
		}
		if(check == false){
			if(attribute_details.sectionRef != undefined){
				if(attribute_details.sectionRef.attributeSectionId)
					$scope.secId = attribute_details.sectionRef.attributeSectionId;
				else
					$scope.secId = attribute_details.sectionRef;
			} 
			attributeSection.get({url:'attributeSectionOne',id:$scope.secId}).$promise.then(function(data){
				if(data.exist == "true" || $scope.secId == undefined){
					if($scope.attributeForm.$valid){
						$scope.refactorData(attribute_details);
						getObject(attribute_details);
						if(attribute_details.valueOptions == undefined){
							attribute_details.valueOptions = [];
						} 
						if(attribute_details.unitOfMeasure != undefined){
							if(attribute_details.unitOfMeasure.length > 0)
								attribute_details.unitOfMeasure = attribute_details.unitOfMeasure[0].name;
							else
								delete attribute_details.unitOfMeasure;
						} 
						if(data._id)
							attribute_details.sectionRef = data._id;
						else 
							delete attribute_details.sectionRef;
						attribute.update({url:'attribute',attribute_id:id},attribute_details).$promise.then(function(data){
							growl.addSuccessMessage('Attribute updated Succesfully');
							$scope.attribute_view(id);
						}).catch(function(error){
							growl.addErrorMessage('oops! Something went wrong');
						})
					}
					else
					{
						var modalInstance = $modal.open({
						templateUrl: 'alert.html',
						controller: 'ModalInstanceCtrl',
						});
					}
				}
				else growl.addErrorMessage('Please enter valid section');
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			})
		} else {
			growl.addErrorMessage('Please add atleast one attribute value option');
		}
	};

	$scope.reset();
	$scope.list_section();
	$scope.view_page();

	function view_attribute(){
		if($scope.obj == undefined){
			$scope.obj = {};
			$scope.obj.id = $routeParams.id;
			$scope.isFromCG = true;
		}
		attribute.get({url:'attribute',attribute_id:$scope.obj.id}).$promise.then(function(data){
			$scope.attribute = data;
			$scope.valueDetails = $scope.attribute.timestamp;
			if($scope.unitOfMeasures != undefined){
				for(var i=0;i<$scope.unitOfMeasures.length; i++){
					if($scope.attribute.unitOfMeasure == $scope.unitOfMeasures[i].name){
						$scope.attribute.unitOfMeasure = [];
						$scope.attribute.unitOfMeasure[0] = {};
						$scope.attribute.unitOfMeasure[0] = $scope.unitOfMeasures[i];
						$scope.attribute.unitOfMeasure[0].ticked = true;
					}
				}
			}
			if($scope.attribute.types != undefined && $scope.attribute.types.length > 0){
				if($scope.attribute.isMultivalued == false){
					for (var j = 0; j < $scope.typesDataDup.length; j++) {	
						if($scope.attribute.types[0].typeName == $scope.typesDataDup[j].typeName){
							if($scope.attribute.types[0].maxValue != undefined)
								$scope.typesDataDup[j].maxValue= $scope.attribute.types[0].maxValue;
							if($scope.attribute.types[0].minValue != undefined)
								$scope.typesDataDup[j].minValue= $scope.attribute.types[0].minValue;
							if($scope.attribute.types[0].maximumLength != undefined)
								$scope.typesDataDup[j].maximumLength= $scope.attribute.types[0].maximumLength;
							if($scope.attribute.types[0].minimumLength != undefined)
								$scope.typesDataDup[j].minimumLength= $scope.attribute.types[0].minimumLength;
							if($scope.attribute.types[0].regularExp != undefined)
								$scope.typesDataDup[j].regularExp= $scope.attribute.types[0].regularExp;
							$scope.attribute.types[0] = $scope.typesDataDup[j];
							$scope.attribute.types[0].ticked = true;
						} 
					}	
				} else {
					$scope.typesDataDup=angular.copy($scope.typesData);
					for (var i = 0; i < $scope.attribute.types.length; i++) {
						for (var j = 0; j < $scope.typesDataDup.length; j++) {	
							if($scope.attribute.types[i].typeName == $scope.typesDataDup[j].typeName){
								$scope.typesDataDup[j].ticked = true;
							} 
						}	
					}
				}
			} 
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		})
	}
	function getObject(theObject) {
		var result = null;
	    if(theObject instanceof Array) {
    		for(var i = 0; i < theObject.length; i++) {
             result = getObject(theObject[i]);
        }
	    }
	    else
	    {
	        for(var prop in theObject) {
	           if(theObject[prop]===""){
	            delete theObject[prop];
	             //console.log('deleted',theObject.prop)
	           }
	             if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
	                 result = getObject(theObject[prop]);
	        }
	    }
	};

	/*   Attribute Value Option  */

	$scope.clearData = function () {
		$scope.initModal();
	}

	$scope.initModal = function () {
		$scope.newValueOption = {
			orderNo: 0,
			surchargeFactor: 0,
			surchargeAmount: 0
		};
		$scope.newValueOption.descriptions = [{"language":'en', "description":null}];
		$timeout(function () {
      $scope.newValueOption.orderNo = null;
      $scope.newValueOption.surchargeFactor = null;
      $scope.newValueOption.surchargeAmount = null;
    });
	}
	
	$scope.attribute.valueOptions = [];

	$scope.newAttributeValueOption = function () {
		$scope.desValid = false;
		$scope.btnValid = false;
		$scope.value_page = "new";
		$scope.initModal();
		$scope.resetCurrencyField();
	}

	$scope.editValueOption = function(value_dtls, index) {
		$scope.resetCurrencyField();
		$scope.value_page = "view";
		if(index != undefined){
			$scope.index = index;
			$scope.value_page = "edit";
		}
		$scope.edit_flag = true;
		$scope.newValueOption = angular.copy(value_dtls);
		if($scope.newValueOption.currency){
			for(var i=0; i<$scope.currencyCode.length ; i++){
				if($scope.newValueOption.currency == $scope.currencyCode[i].code){
					$scope.newValueOption.currency = [];
					$scope.newValueOption.currency[0] = {};
					$scope.newValueOption.currency[0].code = $scope.currencyCode[i].code;
					$scope.newValueOption.currency[0].ticked = true;
					$scope.currencyCode[i].ticked = true;
				}
			}
		} 
		$('#attributeValueOptionModal').modal('show');
	}

	$scope.deleteValueOption = function(indx){
			$scope.attribute.valueOptions.splice(indx,1);
			growl.addSuccessMessage('Attribute Value Option is deleted Succesfully');
	}

	var valid = false;
	$scope.validModal = function (value_details, edit_flag) {
		if(value_details.value){
			$scope.desValid = false;
			$scope.btnValid = true;
			valid = true;
		}
	}

	$scope.resetCurrencyField = function () {
		for(var i=0; i<$scope.currencyCode.length ; i++){		
				$scope.currencyCode[i].ticked = false;
		}
	}

	$scope.addAttributeValueOption = function (value_details, edit_flag, valid) {
		for(var i=0; i<value_details.descriptions.length; i++) {
			if(value_details.descriptions[i].description == null
			|| value_details.descriptions[i].description == "") {
				if(value_details.descriptions.length == 1){
					value_details.descriptions[i] = {"language":'en', "description": " "};
				} else {
					$scope.remove_valueDescription(value_details.descriptions, i);
				}
			}
		}
		if(value_details.currency != undefined && value_details.currency.length == 1){
			value_details.currency = value_details.currency[0].code;
		}
		if(value_details.isDefault == undefined){
			value_details.isDefault = false;
		}
		if(value_details.surchargeFactor == null)
			delete value_details.surchargeFactor;
		if(value_details.surchargeAmount == null)
			delete value_details.surchargeAmount;
		if(valid == true){
			if(edit_flag == true){
				getObject(value_details);
				$scope.attribute.valueOptions[$scope.index] = value_details;
				growl.addSuccessMessage('Attribute Value Option updated Succesfully');
				$scope.index = null;
			}
			else {
				getObject(value_details);
				if($scope.attribute.valueOptions == null || $scope.attribute.valueOptions == undefined){
					$scope.attribute.valueOptions = [];
				}
				$scope.attribute.valueOptions.push(value_details);
				growl.addSuccessMessage('Attribute Value Option created Succesfully');
			}
			valid = false;
		} else {
			growl.addErrorMessage('Please enter required and valid fields.');
			$scope.validModal(value_details, edit_flag);
		}
	}
}]);

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
	$scope.cancel = function () {
	$modalInstance.dismiss('cancel');
	};
});