myApp.controller('classificationGroupCtrl', ['$scope', '$rootScope', 
	'$http', '$location', 'classificationGroup', '$timeout', 
	'classification', 'attribute', 'status', 'growl', '$modal', 
	'$routeParams', 'blockUI',
	function($scope, $rootScope, $http, $location, classificationGroup, 
		$timeout, classification, attribute, status, growl, $modal, 
		$routeParams, blockUI, $modalInstance){
		$scope.obj={id:""};
		$scope.index;
		$scope.tree = [];
		$scope.master = false;
		$scope.isSubChild = true;
		$scope.result = {"checked": false};
		$scope.searchResult = [];
		$scope.itemsPerPage = 5;
		$scope.btnCreate = false;
		$scope.btnAttribute = true;
		$scope.enableParent = true;
		$scope.isChild = false;

		$scope.languageList = [{"name":'German', "iso":'de'},
													 {"name":'English', "iso":'en'}
													];

		$scope.master = {
			// $scope.attributeSection.timestamp.createdBy = 'jcadmin';
			// $scope.attributeSection.timestamp.updatedBy = 'jcadmin';
		};

/****************** Dialog Boxes Handlers *****************/
		
		$scope.closeModal = function () {
			$('#confirmationDailogBox').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		} 

		$scope.switchAttrPage = function () {
			$location.path('/attribute/'+$scope.attrLink);
		}

		$scope.redirectToAttribute = function (link) {
			$scope.redirectAttr = true;
			$scope.attrLink = link;
		}

		$scope.isCreateSubGroup = function(confirm, cgDetails){
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

		$scope.checkAttributeId = function (attInfo) {
			$scope.setIncorrect = false;
			if(attInfo != undefined){
				if(attInfo.attributeId != undefined)
					attInfo = attInfo.attributeId;
			}
			for (var i = 0; i < $scope.classificationGroup.classGrp2Attributes.length-1; i++) {
				if($scope.classificationGroup.classGrp2Attributes[i].attributeRef.attributeId == 
				attInfo){
					growl.addErrorMessage('You have entered same attribute twice, please select another attribute');
					$scope.setIncorrect = true;
				} 
			};
		}

		$scope.attDesc = [];
		$scope.searchAttributeList = function($viewValue){ 
			var temp = [];
			var obj = {};
			obj['key'] = "attributeId";
   		obj['value'] = $viewValue;
			temp.push(obj);
			return attribute.searchQuery({url:'attributeSearch'},temp).$promise.
			then(function(data){	 
				var attributes = [];
	      angular.forEach(data, function(item){  
	        if(item.descriptions.descShort[0].description != undefined && 
	        	item.descriptions.descShort[0].description != ""){
	        	attributes.push({ "attributeId": item.attributeId, "_id": item._id, 
	        	"desc":item.descriptions.descShort[0].description, "comma": ', ' });
	        } else {
	        	attributes.push({ "attributeId": item.attributeId, "_id": item._id });
	        }
	      });
	      return attributes;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			});
		}

		$scope.searchParentList = function($viewValue){
			var temp = [];
			var obj = {};
			obj['key'] = "classificationGroupId";
 			obj['value'] = $viewValue;
 			temp.push(obj);
 			var obj1 = {};
 			obj1['key'] = "classificationRef";
 			obj1['value']= $rootScope.classification_id;
			temp.push(obj1);
			return classificationGroup.searchQuery({url:'classificationGroupSearch'},temp).$promise.
			then(function(data){
				var parents = [];
	      angular.forEach(data, function(item){
	     		if(item.descriptions.descShort[0].description != undefined && 
	        	item.descriptions.descShort[0].description != "" && 
	        	item.descriptions.descShort[0].description != " "){
	     			 parents.push({ "classificationGroupId": item.classificationGroupId, 
	        	"_id": item._id, 
	        	"desc":item.descriptions.descShort[0].description, "comma": ', ' });
	        } else {
	        	 parents.push({ "classificationGroupId": item.classificationGroupId, 
	        	"_id": item._id, 
	        	"desc":item.descriptions.descShort[0].description });
	        }
	      });
	      return parents;
			}).catch(function(error){
				growl.addErrorMessage('oops! Something went wrong');
			});
		}

		$scope.getDesc = function () {
			if($scope.classificationGroup.classGrp2Attributes != undefined && 
				$scope.classificationGroup.classGrp2Attributes != null){
				for(var i=0; i<$scope.classificationGroup.classGrp2Attributes.length ; i++){
					if($scope.classificationGroup.classGrp2Attributes[i] != null) {
						if($scope.classificationGroup.classGrp2Attributes[i].attributeRef.descriptions.descShort[0]){
							$scope.classificationGroup.classGrp2Attributes[i].attributeRef.desc = null;
							$scope.classificationGroup.classGrp2Attributes[i].attributeRef.desc = 
							$scope.classificationGroup.classGrp2Attributes[i].attributeRef.descriptions.descShort[0].description;
						}	
					} else {
						if($scope.classificationGroup.classGrp2Attributes.length == 1)
							$scope.classificationGroup.classGrp2Attributes = [];
						else {
							delete $scope.classificationGroup.classGrp2Attributes[i];
							$scope.classificationGroup.classGrp2Attributes.length--;
						}
					}	
				}
			}
		}

		$scope.prefill_page = function() {
			$scope.classificationGroup.classificationRef = {};
			$scope.classificationGroup.classificationRef._id = $rootScope.classification_id;
			$scope.classificationGroup.classificationRef.classificationId = $rootScope.classificationId;
			$scope.classificationGroup.descriptions = {};
	    $scope.classificationGroup.descriptions.descShort = [{"language":'en', "description": null}];
			$scope.classificationGroup.descriptions.descLong = [{"language":'en', "description": null}];
		}
    $scope.classificationGroup_page = function(classificationId) {
  		$scope.searchQuery = {};
  		$scope.searchVar.value = false;
  		$scope.isSubChild = true;
  		$scope.hideSearch();
  		$scope.classificationGroup = {};
  		$scope.classificationGroup.classificationRef = {};
  		$scope.classificationGroup.classificationRef._id = $rootScope.classification_id;
			$scope.classificationGroup.classificationRef.classificationId = classificationId;
			$scope.classificationGroup.descriptions = {};
			$scope.classificationGroup.descriptions.descShort = [{"language":'en', "description": null}];
			$scope.classificationGroup.descriptions.descLong = [{"language":'en', "description": null}];    	
			$scope.parentAttributesList = [];
			$scope.btnAttribute = true;
			$scope.btnCreate = false;
			$scope.enableParent = true;
			$scope.parentField = false;
		}

		$scope.parentAttributes = function (id) {
			classificationGroup.query({url:'getAttributes', classificationGroup_id:id}).$promise.then(function(data){
				$scope.parentAttributesList = data;
			}).catch(function(error){
				growl.addErrorMessage('Oops! Something went wrong');
			});
		}

		$scope.view_parentAttribute = function (parent_Attribute) {
			$scope.parent_page = "view";
			parent_Attribute.attributeRef = {};
			parent_Attribute.attributeRef.attributeId = parent_Attribute.attributeId;
			$scope.edit_attribute(parent_Attribute);
		}

  	$scope.tree_data = function () {
  		// Block the user interface
    	blockUI.start();
  		classificationGroup.get({url:'classificationGroupTree', classificationGroup_id:$rootScope.classification_id}).$promise.then(function(data){
				$scope.tree[0] = data;
				// Unblock the user interface
      	blockUI.stop();
			}).catch(function(error){
				growl.addErrorMessage('Oops! Something went wrong');
			});
  	}

  	$scope.btnShow = function(){
  		$scope.btnCreate = true;
  	}

  	$scope.slectedParentShow = function () {
  		if($scope.classificationGroup.parentClassificationGrpRef != undefined){
				for(var i=0; i< $scope.tree[0].dropdownData.length ; i++){
					if($scope.classificationGroup.parentClassificationGrpRef._id == 
						$scope.tree[0].dropdownData[i].parent_id){
						$scope.classificationGroup.parentClassificationGrpRef = {};
						$scope.classificationGroup.parentClassificationGrpRef.classificationGroupId = $scope.tree[0].dropdownData[i].parentId;
						$scope.classificationGroup.parentClassificationGrpRef._id = $scope.tree[0].dropdownData[i].parent_id;
					}
				}
			}
  	}

  	$scope.selectNode = function (parent_id, parent, subchild, pid, btn, child) {
  		$scope.parentField = false;
  		$scope.rowNo = -1;
  		$scope.isChild = false;
  		$scope.btnAttribute = true;
  		$scope.btnShow();
  		$scope.searchQuery = {};
  		$scope.searchVar.value = false;
  		$scope.hideSearch();
  		$scope.parent_id = parent_id;
  		$scope.enableParent = true;
  		$scope.invalidInfo = [];
  		// Get a reference to the blockUI instance
			var attributeBlock = blockUI.instances.get('attributeBlock');
			attributeBlock.start();
  		classificationGroup.get({url:'classificationGroup',id:parent_id})
  			.$promise.then(function(data){
				$scope.classificationGroup = data;
				$scope.slectedParentShow();
				
				if($scope.classificationGroup.descriptions.descShort.length == 0) {
					$scope.classificationGroup.descriptions.descShort = [{"language":'en', "description": null}];
				}
				if($scope.classificationGroup.descriptions.descLong.length == 0) {
					$scope.classificationGroup.descriptions.descLong = [{"language":'en', "description": null}];
				}
				$scope.parentAttributesList = [];
				if(pid){
					$scope.parentAttributes(pid);
				}
				if(parent == true){
					$scope.parentField = true;
				}
				if(subchild == true){
					$scope.isSubChild = true;

				} else {
					$scope.isSubChild = false;
				}
				if(btn == true){
					$scope.btnCreate = false;
					$scope.btnAttribute = false;
				}
				if(child == true){
					$scope.isChild = true;
				}
				$scope.getDesc();
				attributeBlock.stop();
			}).catch(function(error){
				growl.addErrorMessage('Oops! Something went wrong');
			});
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
		/*----------------------------------*/

  $scope.refactorData = function (classificationGroup_details) {
  	for(var i=0; i<classificationGroup_details.descriptions.descShort.length; i++) {
			if(classificationGroup_details.descriptions.descShort[i].description == null
				|| classificationGroup_details.descriptions.descShort[i].description == "") {
				if(classificationGroup_details.descriptions.descShort.length == 1){
					classificationGroup_details.descriptions.descShort[i] = {"language":'en', "description": ''};
				} else {
					$scope.remove_sd(classificationGroup_details.descriptions.descShort,i);
				}
			}
		}
		for(var i=0; i<classificationGroup_details.descriptions.descLong.length; i++) {
			if(classificationGroup_details.descriptions.descLong[i].description == null
				|| classificationGroup_details.descriptions.descLong[i].description == "") {
				if(classificationGroup_details.descriptions.descLong.length == 1){
					classificationGroup_details.descriptions.descLong[i] = {"language":'en', "description": ''};
				} else {
					$scope.remove_ld(classificationGroup_details.descriptions.descLong, i);
				}
			}
		}
  }

  $scope.getClassDetails = function (classificationGroup_details) {
  	$scope.classificationGroup.classificationRef = {};
		$scope.classificationGroup.classificationRef._id = $rootScope.classification_id;
		$scope.classificationGroup.classificationRef.classificationId = $rootScope.classificationId;
		$scope.classificationGroup.parentClassificationGrpRef = {};
		if($scope.pRef != undefined){
			if($scope.pRef._id){
				$scope.classificationGroup.parentClassificationGrpRef._id = $scope.pRef._id;
			}
			if($scope.pRef.classificationGroupId){
				$scope.classificationGroup.parentClassificationGrpRef.classificationGroupId = 
				$scope.pRef.classificationGroupId;
			} else {
				$scope.classificationGroup.parentClassificationGrpRef.classificationGroupId = $scope.pRef;
			}
		}
  }
  $scope.restoreAttributes = function (classificationGroup_details) {
  	for (var i = 0; i < classificationGroup_details.classGrp2Attributes.length; i++) {
  		if($scope.aRef[i] != null){
  			$scope.classificationGroup.classGrp2Attributes[i].attributeRef ={};
  			$scope.classificationGroup.classGrp2Attributes[i].attributeRef._id = 
  			$scope.aRef[i]._id;
  			$scope.classificationGroup.classGrp2Attributes[i].attributeRef.attributeId = 
  			$scope.aRef[i].attributeId;
  		} else {
  			$scope.classificationGroup.classGrp2Attributes[i].attributeRef._id = 
  			$scope.aRef[i]._id;
  			$scope.classificationGroup.classGrp2Attributes[i].attributeRef.attributeId = 
  			$scope.aRef[i].attributeId;
  		}
  	};
  }

	$scope.submit = function(classificationGroup_details, cid){
		$scope.refactorData(classificationGroup_details);
		getObject(classificationGroup_details);
		
		classificationGroup_details.classificationRef = 
		classificationGroup_details.classificationRef._id;
		if(classificationGroup_details.parentClassificationGrpRef != undefined){
			$scope.pRef = classificationGroup_details.parentClassificationGrpRef;
			if(classificationGroup_details.parentClassificationGrpRef.classificationGroupId)
				$scope.parentName = classificationGroup_details.parentClassificationGrpRef.classificationGroupId;
			else $scope.parentName = classificationGroup_details.parentClassificationGrpRef;
			if(classificationGroup_details.parentClassificationGrpRef._id != undefined){
				classificationGroup_details.parentClassificationGrpRef = 
				classificationGroup_details.parentClassificationGrpRef._id;
			}
		} else {
			delete classificationGroup_details.parentClassificationGrpRef;
		}
		classificationGroup.get({url:'classificationGroupOne' , 
			id: classificationGroup_details.classificationRef, 
			classificationGroup_id: $scope.parentName}).$promise.then(function(data){
				if(data.exist == 'false'){
					$scope.getClassDetails(classificationGroup_details);
					$scope.parentName = null;
					growl.addErrorMessage('Please enter valid Parent Id');
				} 
				else if(data.subchild == 'true'){
					$scope.getClassDetails(classificationGroup_details);
					$scope.parentName = null;
					growl.addErrorMessage('selected Classification Group Id can not be sub child, please enter valid Parent Id');
				}
				else {
					$scope.parentName = null;
					if(data._id){
						classificationGroup_details.parentClassificationGrpRef = data._id;
					}
					if($scope.classificationGroupForm.$valid){
						if(classificationGroup_details.classGrp2Attributes == " " || 
							classificationGroup_details.classGrp2Attributes == undefined){
							delete classificationGroup_details.classGrp2Attributes;
						}		
						$scope.aRef = [];
						if(classificationGroup_details.classGrp2Attributes != undefined){
							$scope.aRef.length = classificationGroup_details.classGrp2Attributes.length;
							for(i=0; i < classificationGroup_details.classGrp2Attributes.length ; i++){		
								if( (classificationGroup_details.classGrp2Attributes[i].attributeRef == undefined 
									&& classificationGroup_details.classGrp2Attributes[i].sortNo == undefined && 
									classificationGroup_details.classGrp2Attributes[i].grpId == undefined) 
									||(classificationGroup_details.classGrp2Attributes[i].isSubmitted == false) 
									|| $scope.invalidInfo[i] == true){
									delete classificationGroup_details.classGrp2Attributes[i];
									classificationGroup_details.classGrp2Attributes.length--;
								} else if(classificationGroup_details.classGrp2Attributes[i].attributeRef) {
									if(classificationGroup_details.classGrp2Attributes[i].attributeRef._id != undefined){
										$scope.aRef[i] = classificationGroup_details.classGrp2Attributes[i].attributeRef;
										classificationGroup_details.classGrp2Attributes[i].attributeRef = 
										classificationGroup_details.classGrp2Attributes[i].attributeRef._id;
									} else {
										$scope.aRef[i] = classificationGroup_details.classGrp2Attributes[i].attributeRef;
									}
								} else {
									$scope.aRef[i] = null;
								}
							}
						}
						else classificationGroup_details.classGrp2Attributes = [];
						if(classificationGroup_details._id == undefined){
							classificationGroup.save({url:'classificationGroup'}, classificationGroup_details).$promise.then(function(data){
							$scope.classificationGroup = data;
							if(data.statusCode != 403){
								growl.addSuccessMessage('Classification Group created succesfully');
							 	$scope.isSubChild = true;
							 	$scope.classificationGroup_page();
							 	$scope.prefill_page();
							 	$scope.tree_data();
							 	// $scope.classificationGroup_view(data._id);
							} 
							else {
								$scope.classificationGroup = angular.copy(classificationGroup_details);
								$scope.getClassDetails(classificationGroup_details);
								$scope.restoreAttributes(classificationGroup_details);
								growl.addErrorMessage(data.message);
								// $scope.classificationGroup = classificationGroup_details;
							}
							 
							}).catch(function(error){
								growl.addErrorMessage('Oops! Something went wrong');
							});
						} 
						else {
							classificationGroup.update({url:'classificationGroup', id:classificationGroup_details._id}, classificationGroup_details).$promise.then(function(data){
							$scope.classificationGroup = data;
							if(data.statusCode != 403){
								growl.addSuccessMessage('Classification Group updated succesfully');
							 	$scope.isSubChild = true;
							 	$scope.classificationGroup_page();
							 	$scope.prefill_page();
							 	$scope.tree_data();
							 	// $scope.classificationGroup_view(data._id);
							} else {
								$scope.classificationGroup = angular.copy(classificationGroup_details);
								$scope.getClassDetails(classificationGroup_details);
								$scope.restoreAttributes(classificationGroup_details);
								$scope.parentName = null;
								growl.addErrorMessage(data.message);
							}
							 
							}).catch(function(error){
								growl.addErrorMessage('Oops! Something went wrong');
							});
						}
					}		
					else {
						$scope.getClassDetails(classificationGroup_details);
						$scope.parentName = null;
						var modalInstance = $modal.open({
						templateUrl: 'alert.html',
						controller: 'ModalInstanceCtrl',
						});
				}
			}
		}).catch(function(error){
			growl.addErrorMessage('Oops! Something went wrong');
		});
	};

	$scope.reset = function() {
		$scope.classificationGroup = angular.copy($scope.master);
		$scope.prefill_page();
	};

	$scope.edit_classificationGroup = function(id){
		$scope.changeView.classificationGroupShow=true;
		$scope.obj.id=id;
		$scope.page = 'edit';
		$scope.subchild = false;
		view_classificationGroup();
	};

	$scope.classificationGroup_view = function(id)
	{
		$scope.changeView.classificationGroupShow=true;
		$scope.obj.id=id;
		$scope.page = 'view';
		view_classificationGroup();
	};

	$scope.cancel_view = function(){
		$scope.changeView.classificationGroupShow=false;
	};
	
	$scope.view_page = function(){	
		$scope.page = 'new';	
	};

	$scope.list_section = function(){
		attribute.query({url:'attribute'}).$promise.then(function(data){
			$scope.attributeList = data; 
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		});
		classification.query({url:'classification'}).$promise.then(function(data){
			$scope.classificationList = data;
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		});
		classificationGroup.query({url:'classificationGroup'}).$promise.then(function(data){
			$scope.classificationGroupList = data;
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		});
		status.query({url:'status'}).$promise.then(function(data){
			$scope.statusList = data;
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		});
	};

	$scope.classGrp2Attributes = [];
	$scope.new_attribute = function(){
		$scope.edit_flag = false;
		$scope.selectedAttribute = []; 
		$scope.newAttribute = {};
		$('#attributeModal').modal('show');
	};

	$scope.setSlave = function(value, searchResult){
		$scope.searchResult = searchResult;
		for(var i=0; i < $scope.searchResult.length ; i++){
			if(value == true) {
				$scope.searchResult[i].checked = true;
			} else {
				$scope.searchResult[i].checked = false;
			}
		}
	}

	$scope.setFlag = function () {
		$scope.edit_flag = false;
	}
	$scope.showForm = false;
	$scope.getAttributeDetails = function (result) {
		if($scope.rowId != 0){
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId] = {};
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].sortNo = 
			$scope.att_info.sortNo;
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].grpId = 
			$scope.att_info.grpId;
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].isSubmitted = 
			$scope.att_info.isSubmitted;
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].attributeRef = {};
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].attributeRef._id = result._id;
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].attributeRef.attributeId = result.attributeId;
			if(result.descriptions.descShort[0].description != undefined){
				$scope.classificationGroup.classGrp2Attributes[$scope.rowId].attributeRef.comma = ', ';
				$scope.classificationGroup.classGrp2Attributes[$scope.rowId].attributeRef.desc = null;
				$scope.classificationGroup.classGrp2Attributes[$scope.rowId].attributeRef.desc = 
				result.descriptions.descShort[0].description;
			}	
		} else if ($scope.rowId == 0){
			$scope.classificationGroup.classGrp2Attributes[0] = {};
			$scope.classificationGroup.classGrp2Attributes[0].sortNo = 
			$scope.att_info.sortNo;
			$scope.classificationGroup.classGrp2Attributes[0].grpId = 
			$scope.att_info.grpId;
			$scope.classificationGroup.classGrp2Attributes[$scope.rowId].isSubmitted = 
			$scope.att_info.isSubmitted;
			$scope.classificationGroup.classGrp2Attributes[0].attributeRef = {};
			$scope.classificationGroup.classGrp2Attributes[0].attributeRef._id = result._id;
			$scope.classificationGroup.classGrp2Attributes[0].attributeRef.attributeId = result.attributeId;
			if(result.descriptions.descShort[0].description != undefined){
				$scope.classificationGroup.classGrp2Attributes[0].attributeRef.comma = ', ';
				$scope.classificationGroup.classGrp2Attributes[0].attributeRef.desc = null;
				$scope.classificationGroup.classGrp2Attributes[0].attributeRef.desc = 
				result.descriptions.descShort[0].description;
			}	
		} else {
			growl.addErrorMessage('Oops! Something went wrong');
		}
		$scope.checkAttributeId(result);
	}

	$scope.getParentDetails = function (result) {
		$scope.classificationGroup.parentClassificationGrpRef = {};
		$scope.classificationGroup.parentClassificationGrpRef.classificationGroupId = result.classificationGroupId;
		$scope.classificationGroup.parentClassificationGrpRef._id = result._id;
		if(result.descriptions.descShort[0].description != undefined){
			$scope.classificationGroup.parentClassificationGrpRef.comma = ', ';
			$scope.classificationGroup.parentClassificationGrpRef.desc = null;
			$scope.classificationGroup.parentClassificationGrpRef.desc = result.descriptions.descShort[0].description;
		}
	}
	$scope.invalidInfo = [];
	$scope.addAttribute = function(attribute_dtls, index, valid)
	{
		if($scope.setIncorrect != true){
			attribute_dtls.isSubmitted = true;
			$scope.invalidInfo.length = $scope.classificationGroup.classGrp2Attributes.length;
			if($scope.edit_flag)
			{
				if(attribute_dtls.attributeRef != undefined){
					if(attribute_dtls.attributeRef.attributeId == undefined){
						$scope.attName = attribute_dtls.attributeRef;
						attribute_dtls.attributeRef = {};
						attribute_dtls.attributeRef.attributeId = $scope.attName;
					}	else {
						$scope.attName = attribute_dtls.attributeRef.attributeId;
					}
					attribute.get({url:'attributeOne',
					attribute_id:attribute_dtls.attributeRef.attributeId}).$promise
					.then(function(data){
						if(data.exist == "true"){
							attribute_dtls.attributeRef._id = data._id;
							if(!valid){
							 growl.addErrorMessage('please enter required and valid field to update new attribute');
								$scope.invalidInfo[index] =true;
							}
							else{
								if($scope.classificationGroup.classGrp2Attributes){
									for(var i=0;i<$scope.classificationGroup.classGrp2Attributes.length;i++)
									{		
										if(i == $scope.index){
											$scope.classificationGroup.classGrp2Attributes[i] = attribute_dtls;
										}
									}
									$scope.invalidInfo[index] = false;
									$scope.edit_flag = false;
									$scope.rowNo = -1;
									growl.addSuccessMessage('attribute updated');
								} 
							}
						} else {
							growl.addErrorMessage('Please enter valid attributeId');
							$scope.invalidInfo[index] = true;
						}
						
					}).catch(function(error){
						growl.addErrorMessage('Oops! Something went wrong');
					});
				}
			}
			else
			{
				if(attribute_dtls.attributeRef != undefined){
					if(attribute_dtls.attributeRef.attributeId == undefined){
						$scope.attName = attribute_dtls.attributeRef;
						attribute_dtls.attributeRef = {};
						attribute_dtls.attributeRef.attributeId = $scope.attName;
					}	else {
						$scope.attName = attribute_dtls.attributeRef.attributeId;
					}
					attribute.get({url:'attributeOne',
					attribute_id:$scope.attName}).$promise
					.then(function(data){
						if(data.exist == "true"){
							attribute_dtls.attributeRef._id = data._id;
							if(valid){
								$scope.invalidInfo[index] = false;
								$scope.rowNo = -1;
								$scope.showForm = false;
								$scope.isSaved = true;
								growl.addSuccessMessage('New attribute is added');
							}	else {
								growl.addErrorMessage('Please enter valid and required data');
								$scope.invalidInfo[index] = true;
							}	
						} else {
							growl.addErrorMessage('Please enter valid attributeId');
							$scope.invalidInfo[index] = true;
						}
					}).catch(function(error){
						growl.addErrorMessage('oops! Something went wrong');
					});
				} else {
					growl.addErrorMessage('Please enter valid and required data');
					$scope.invalidInfo[index] =true;
				}
			}
		} else {
			growl.addErrorMessage('You have entered same attribute twice, please select another attribute');
		}
	};

	var attribute_info = {"sortNo": "",
												"grpId": "",
												"attributeId": "",
												"isSubmitted": false
												};
	
	$scope.isSaved = true;
	$scope.add_attributes = function (index) {
		if($scope.classificationGroup.classGrp2Attributes != undefined){
			for(var i=0; i< $scope.classificationGroup.classGrp2Attributes.length;i++){
				if($scope.classificationGroup.classGrp2Attributes[i].isSubmitted == false 
					|| $scope.invalidInfo[i] == true){
					$scope.aStop = true;
				}
			}
		} else {
			$scope.aStop = false;
		}
		if($scope.aStop != true){
			$scope.edit_flag = false;
			$scope.showList = false;
			if($scope.classificationGroup.classGrp2Attributes == undefined){
				$scope.classificationGroup.classGrp2Attributes = [];
				$scope.classificationGroup.classGrp2Attributes[0] = {};
				$scope.classificationGroup.classGrp2Attributes[0].attributeRef = {};
				$scope.classificationGroup.classGrp2Attributes[0].attributeRef = attribute_info;
			} else {
				$scope.classificationGroup.classGrp2Attributes.push(
					angular.copy(attribute_info));
			}
			$scope.rowNo = $scope.classificationGroup.classGrp2Attributes.length - 1;
			$scope.isSaved = false;	
		} else {
			growl.addErrorMessage('Please add attribute with complete valid data');
			$scope.aStop = false;
		}
			
	}

	$scope.hideSearch = function () {
		$scope.addAttributebtn = false;
	}

	$scope.searchAttribute = function (index, att) {
		$scope.showList = false;
		$scope.reset_search();
		$('#attributeModal').modal('show');
		$scope.rowId = index;
		$scope.att_info = att;
	}

	$scope.searchParentId = function () {
		$scope.setParentsList = false;
		$('#classificationIdSearchModal').modal('show');
	}

	$scope.setShowList = function (){
		$scope.showList = true;
	}
	$scope.setParentList = function () {
		$scope.setParentsList = true;
	}

	$scope.attributes_search = function (searchQuery) {
		$scope.search = true;
		var rqstData = searchQuery;
		attribute.searchQuery({url:'attributeSearch'},rqstData).$promise.then(function(data){
			$scope.searchResult = data;
			$scope.pagedItems[currentPage] = $scope.searchResult;
			$scope.searchQuery.searchDirty = true;
			$scope.currentPage = 0;
			$scope.groupToPages();
		}).catch(function(error){
			growl.addErrorMessage('oops! Something went wrong');
		});
	}

	$scope.resetParentPage = function () {
		$scope.parent_page = "edit";
	}

	$scope.edit_attribute = function(attribute_dtls, index)
	{
		$scope.index = index;
		$scope.rowNo = index;
		$scope.edit_flag = true;
		$scope.index_flag = true;
		$scope.info = angular.copy(attribute_dtls);
	};

	$scope.cancelUpdate = function(att, indx) {
		if($scope.edit_flag == true){
			$scope.classificationGroup.classGrp2Attributes[$scope.index] = 
			$scope.info;
			$scope.edit_flag = false;
			$scope.rowNo = -1;
		} 
		else{
			delete $scope.classificationGroup.classGrp2Attributes.splice(indx);
		}
		
	}

	$scope.delete_attribute = function(indx){
		$scope.classificationGroup.classGrp2Attributes.splice(indx,1);
		growl.addSuccessMessage('Attribute deleted succesfully');
	}
	
	$scope.reset();
	$scope.view_page();
	$scope.list_section();
	$scope.classGrp2Attributes = [];
	
	function view_classificationGroup(){
		classificationGroup.get({url:'classificationGroup',classificationGroup_id: $scope.obj.id }).$promise.then(function(data){
			$scope.classificationGroup = data;
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
		else{
			for(var prop in theObject) {
				if(theObject[prop]===""){
					delete theObject[prop];
				}
				if(theObject[prop] instanceof Object  || theObject[prop] instanceof Array)
					result = getObject(theObject[prop]);
			}
		}
	};

	$scope.attributeValidation = function(){
	      return  ( modalForm.$invalid);
	}

	$scope.hideMe = function() {
	return $scope.selectedAttribute.length > 0;
	}
	
	$scope.createChild = function (classification, parent, cid, pid) {
		$scope.closeModal();
		$scope.enableParent = false;
		$scope.btnAttribute = true;
		$scope.addAttribute = true;
		$scope.btnCreate = false;
		$scope.searchVar.value = false;
		$scope.hideSearch();
		$scope.isSubChild = true;
		$scope.parentField = true;
		$scope.classificationGroup = {};
		$scope.classificationGroup.classificationRef = {};
		$scope.classificationGroup.parentClassificationGrpRef = {};
		$scope.classificationGroup.classificationRef.classificationId = classification;
		$scope.classificationGroup.parentClassificationGrpRef.classificationGroupId = parent;
		$scope.classificationGroup.classificationRef._id = cid;
		$scope.classificationGroup.parentClassificationGrpRef._id = $scope.parent_id;
		$scope.classificationGroup.descriptions = {};
		$scope.classificationGroup.descriptions.descShort = [{"language":'en', "description": null}];
		$scope.classificationGroup.descriptions.descLong = [{"language":'en', "description": null}]; 
		$scope.slectedParentShow();
		$scope.parentAttributes($scope.parent_id);
		if($scope.isChild == true){
			$scope.btnAttribute = false;
		}
	}
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