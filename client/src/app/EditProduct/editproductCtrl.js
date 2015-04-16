myApp.controller('EditProductCtrl', ['$scope', '$rootScope',
    '$http', '$location', 'growl', '$modal', '$routeParams', '$filter',
    'blockUI','$q','uiGridConstants',
    function($scope, $rootScope, $http, $location,
        growl, $modal, $routeParams, blockUI, $filter,$q,uiGridConstants) {



       

        $scope.updateitem = function(editproduct) {
            $http.put('/updateProduct/' + editproduct._id, editproduct)
                .success(function(status, data) {
                });

        }

        $scope.cancel = function() {
            $location.path('/');
        }

        var init = function() {
            var urlBase = '/getProduct/';
            $http.get(urlBase + $routeParams.id)
                .then(function(result) {
                    $scope.editproduct = result.data;
                     $scope.gridOptions.data = $scope.editproduct.attributeValues;
                })
                .catch(function(err) {
                    console.log('error')
                })


        }


        init();

        


        // $scope.fetchProductData = function(){

        // 	$scope.editproduct = getProductDataFactory.getlocalData();

        // }


        // Preview Button Show hide

        $scope.previewvar = true;


        $scope.showhidepreview = function() {

            $scope.previewvar = false;



        }

        // datepicker

        $scope.date = {
            startDate: null,
            endDate: null
        };

        $scope.opened = {};

        $scope.open = function($event) {

            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = {};
            $scope.opened[$event.target.id] = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        // Filter

        $scope.sortType = 'name'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order
        $scope.search = ''; // set the default search/filter term






        // Product classification


        $scope.showvar = false;

        $scope.assignGrp = function() {
            $scope.showvar = true;
            $scope.editvar = false;
            $scope.createNew = {};
        }


        $scope.editvar = false;

        $scope.editGrp = function(data) {
            $scope.editrow = data;
            // if(data.variantId){
            // 	$scope.editrow.variantId=parseInt(data.variantId);
            // }
            $scope.editvar = true;
            $scope.showvar = false;
        }

        // $scope.$watch('output.mk',function(){
        // 	if($scope.output.mk.length>0)
        // 	// $scope.search.variantId=$scope.output.mk[0].variantId;
        // })
        $scope.test = function() {
            console.log('sdsd');
        }




        $scope.newClsfnidGrp = function(createNewGrp) {
            $scope.editproduct.classificationGroupAssociations.push(angular.copy(createNewGrp));
            $scope.updateitem($scope.editproduct);
            $scope.createNew = {};
        }

        $scope.newAttribute = function(createNewAttribute) {
           createNewAttribute.channels = $scope.channels;
            $scope.editproduct.attributeValues.push(createNewAttribute);
            $scope.updateitem($scope.editproduct);
            $scope.doc = {};
        }

        // $scope.seeChannel = function() {
        //     $scope.editproduct.attributeValues.push(createNewAttribute);
        //     $scope.updateitem($scope.editproduct);
        //     // $scope.createNew = {};
        // }


        // check Uncheck check boxes


        $scope.isAll = false;

        $scope.selectAllcBoxes = function() {


            if ($scope.isAll === false) {
                angular.forEach($scope.editproduct.classificationGroupAssociations, function(checkbox) {
                    checkbox.checked = true;

                });

                $scope.isAll = true;
            } else {
                angular.forEach($scope.editproduct.classificationGroupAssociations, function(checkbox) {
                    checkbox.checked = false;
                });
                $scope.isAll = false;
            }
        }



        // delete item
        $scope.deleteRow = function() {
            for (var i = $scope.editproduct.classificationGroupAssociations.length - 1; i >= 0; i--) {
                if ($scope.editproduct.classificationGroupAssociations[i].checked == true)
                    $scope.editproduct.classificationGroupAssociations.splice(i, 1);
            };
            $scope.updateitem($scope.editproduct);
            $scope.createNew = {};
        }




        // Attribute Tab

        $scope.attvar = false;

        $scope.select = {};
        $scope.hidecol = function(x) {
            $scope.select.atrcolhide=angular.copy(x);
        }

        // ui-grid

       $scope.gridOptions = {};

          $scope.gridOptions.columnDefs = [
            { name:"Attribute",field: 'attribute',enableCellEdit: false},
            { name:"Value",field: 'value' },
            { name:"Variant",field: 'variantId',enableCellEdit: false},
            { name:"Language",field: 'languageId',enableCellEdit: false },
            { name:"Order No.",field: 'orderNro' },
            // { name:"Status",field: 'statusId', editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'status',
            //     selectOptions: [ { value : '080', label : '080 error' },
            //                      { value : '090', label : '090 warning' },
            //                      { value : '100', label : '100 new' },
            //                      { value : '105', label : '105 changed' },
            //                      { value : '200', label : '200 checked' },
            //                      { value : '225', label : '225 translate' },
            //                      { value : '250', label : '250 Translation needed' },
            //                      { value : '275', label : '275 Translation in progress' },
            //                      { value : '300', label : '300 waiting' },
            //                      { value : '350', label : '350 translate' },
            //                      { value : '400', label : '400 confirmed' },
            //                      { value : '420', label : '420 Immediate' },
            //                      { value : '700', label : '700 temporary' },
            //                      { value : '800', label : '800 deleted' }
            //                       ]}



            { name:"statusId",field: 'statusId', editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'status',
                    editDropdownOptionsArray: [
                                          { status: '080 error'                  , id: '080'     },
                                          { status: '090 warning'                , id: '090'        },
                                          { status: '100 new'                    , id: '100'    },
                                          { status: '105 changed'                , id: '105'        },
                                          { status: '200 checked'                , id: '200'         },
                                          { status: '225 translate'              , id: '225'              },
                                          { status: '250 Translation needed'     , id: '250'       },
                                          { status: '275 Translation in progress', id: '275'             },
                                          { status: '300 waiting'                , id: '300'            },
                                          { status: '350 translate '             , id: '350'             },
                                          { status: '400 confirmed'              , id: '400'                 },
                                          { status: '420 Immediate'              , id: '420'            },
                                          { status: '700 temporary'              , id: '700'              },
                                          { status: '800 deleted'                , id: '800'               }
                                        ] }


            ];



            // .filter('mapStatus', function() {
            //   var sizeHash = {
                
            //     080    : '080 error'                  ,
            //     090    : '090 warning'                ,
            //     100    : '100 new'                    ,
            //     105    : '105 changed'                ,
            //     200    : '200 checked'                ,
            //     225    : '225 translate'              ,
            //     250    : '250 Translation needed'     ,
            //     275    : '275 Translation in progress',
            //     300    : '300 waiting'                ,
            //     350    : '350 translate '             ,
            //     400    : '400 confirmed'              ,
            //     420    : '420 Immediate'              ,
            //     700    : '700 temporary'              ,
            //     800    : '800 deleted'                
            //   };

        // $scope.gridOptions2 = {
        //     enableSorting: true,
        //     columnDefs: [ 
        //       { field: 'Attribute' },
              // { field: 'Variant' },
              // { field: 'Language' },
              // { field: 'Value' },
              // { field: 'Order No.' },
              // { field: 'Status' }
          //   ],
          //   onRegisterApi: function( gridApi ) {
          //     $scope.grid2Api = gridApi;
          //   }
          // };
          
          
             
            



        // Document Tab


        $scope.docvar = false;

        $scope.createdoc = function() {

            $scope.docvar = true;
            $scope.doc = {};

        }


        $scope.savedoc = function(docdata) {

            // $scope.editproduct.documents.push(angular.copy(docdata));
            // $scope.updateitem($scope.editproduct);
            // console.log($scope.editproduct);
            if (docdata._id) {
                angular.forEach($scope.editproduct.documents, function(value, key) {

                    if (docdata._id == value._id) {
                        $scope.editproduct.documents[key] = docdata;
                        $scope.updateitem($scope.editproduct);

                        // console.log($scope.editproduct.documents);
                        // console.log($scope.editproduct);
                    }

                });
            } else {
                $scope.editproduct.documents.push(angular.copy(docdata));
                $scope.updateitem($scope.editproduct);
                $scope.doc = {};
            }

        }



        $scope.editdoc = function(editdocdata) {

            $scope.docvar = true;

            $scope.doc = angular.copy(editdocdata);
        }



        $scope.isdocAll = false;

        $scope.selectAlldocCBoxes = function() {
            if ($scope.isdocAll === false) {
                angular.forEach($scope.editproduct.documents, function(checkbox) {
                    checkbox.checked = true;

                });

                $scope.isdocAll = true;

            } else {
                angular.forEach($scope.editproduct.documents, function(checkbox) {
                    checkbox.checked = false;
                });
                $scope.isdocAll = false;
            }
        }



        // delete list
        $scope.deletedoc = function() {
            for (var i = $scope.editproduct.documents.length - 1; i >= 0; i--) {
                if ($scope.editproduct.documents[i].checked == true)
                    $scope.editproduct.documents.splice(i, 1);
            };
            $scope.updateitem($scope.editproduct);
            $scope.doc = {};

        }

        // $scope.selectedRow = function (id, value) {
        // 	console.log('//////////', id);
        // 	if(value) 
        // 		$scope.selectedId = id;
        // }


        // Document tab function End

        $scope.doc = {};


        // Price tab function Start

        $scope.pricevar = false;

        $scope.newprice = function() {

            $scope.pricevar = true;
            $scope.price = {};

        }


        // Accordion tab

        $scope.status = {
            isFirstOpen: true,
        };



        $scope.saveprice = function(pricedata) {

            // $scope.editproduct.documents.push(angular.copy(docdata));
            // $scope.updateitem($scope.editproduct);
            // console.log($scope.editproduct);
            if (pricedata._id) {
                angular.forEach($scope.editproduct.prices, function(value, key) {

                    if (pricedata._id == value._id) {
                        $scope.editproduct.prices[key] = pricedata;
                        $scope.updateitem($scope.editproduct);


                    }

                });
            } else {
                $scope.editproduct.prices.push(angular.copy(pricedata));
                $scope.updateitem($scope.editproduct);
                $scope.price = {};
            }

        }


        $scope.editprice = function(editpricedata) {

            $scope.pricevar = true;

            $scope.price = angular.copy(editpricedata);
        }


        $scope.deleteprice = function() {
            for (var i = $scope.editproduct.prices.length - 1; i >= 0; i--) {
                if ($scope.editproduct.prices[i].checked == true)
                    $scope.editproduct.prices.splice(i, 1);
            };
            $scope.updateitem($scope.editproduct);
            $scope.price = {};

        }


        $scope.ispriceAll = false;

        $scope.selectAllpriceCBoxes = function() {
            if ($scope.ispriceAll === false) {
                angular.forEach($scope.editproduct.prices, function(checkbox) {
                    checkbox.checked = true;

                });

                $scope.ispriceAll = true;

            } else {
                angular.forEach($scope.editproduct.prices, function(checkbox) {
                    checkbox.checked = false;
                });
                $scope.ispriceAll = false;
            }
        }



        //Price tab function end 



        // Contracted Product function start


        $scope.cproductvar = false;


        $scope.newcproduct = function() {

            $scope.cproductvar = true;
            $scope.cproduct = {};

        }




        $scope.savecproduct = function(cproductdata) {

            // $scope.editproduct.documents.push(angular.copy(docdata));
            // $scope.updateitem($scope.editproduct);
            // console.log($scope.editproduct);
            if (cproductdata._id) {
                angular.forEach($scope.editproduct.contractedProducts, function(value, key) {

                    if (cproductdata._id == value._id) {
                        $scope.editproduct.contractedProducts[key] = cproductdata;
                        $scope.updateitem($scope.editproduct);


                    }

                });
            } else {
                $scope.editproduct.contractedProducts.push(angular.copy(cproductdata));
                $scope.updateitem($scope.editproduct);
                $scope.cproduct = {};
            }

        }



        $scope.editcproduct = function(editcproductdata) {

            $scope.cproductvar = true;

            $scope.cproduct = angular.copy(editcproductdata);
        }




        $scope.deletecproduct = function() {
            for (var i = $scope.editproduct.contractedProducts.length - 1; i >= 0; i--) {
                if ($scope.editproduct.contractedProducts[i].checked == true)
                    $scope.editproduct.contractedProducts.splice(i, 1);
            };
            $scope.updateitem($scope.editproduct);
            $scope.cproduct = {};

        }


        $scope.iscproductAll = false;

        $scope.selectAllcproductCBoxes = function() {
            if ($scope.iscproductAll === false) {
                angular.forEach($scope.editproduct.contractedProducts, function(checkbox) {
                    checkbox.checked = true;

                });

                $scope.iscproductAll = true;

            } else {
                angular.forEach($scope.editproduct.contractedProducts, function(checkbox) {
                    checkbox.checked = false;
                });
                $scope.iscproductAll = false;
            }
        }




        // Contracted product funcion end


        //Relation tab

		$scope.nproductvar = false;


        $scope.newprelation = function() {

            $scope.nproductvar = true;
            $scope.prelation = {
                descriptions: [{
                    language: 'en',
                    description: ''
                }]
            }
            $scope.selectedlang = ['en'];


        }


        $scope.addlang = function() {
            var lang = ['en', 'es', 'fr', 'de'];

            if ($scope.prelation.descriptions.length <= 4) {
                angular.forEach($scope.prelation.descriptions, function(val, key) {
                    angular.forEach(lang, function(val1, key1) {
                        if (val1 == val.language)
                            lang.splice(key1, 1);
                    })
                })
                $scope.prelation.descriptions.push({
                    language: lang[0],
                    description: ''
                });
                $scope.selectedlang.push(lang[0]);
            }
        }

        $scope.delLang = function(index) {

            vardelitem = $scope.prelation.descriptions.splice(index, 1);
            $scope.selectedlang.splice($scope.selectedlang.indexOf(vardelitem[0].language), 1)

        }
        $scope.changeoption = function(index, newval, oldval) {
            $scope.selectedlang[$scope.selectedlang.indexOf(oldval)] = newval;

        }

        $scope.editlang = function() {
            var lang = ['en', 'es', 'fr', 'de'];
                angular.forEach($scope.prelation.descriptions, function(val, key) {
                    angular.forEach(lang, function(val1, key1) {
                        if (val1 == val.language){
                            var temp=lang.splice(key1, 1);
                            $scope.selectedlang.push(temp[0]);
                        }
                    })
                })
                
                
        }




        $scope.saverelation = function(relationdata) {

            // $scope.editproduct.documents.push(angular.copy(docdata));
            // $scope.updateitem($scope.editproduct);
            // console.log($scope.editproduct);
            if (relationdata._id) {
                angular.forEach($scope.editproduct.productRelations, function(value, key) {

                    if (relationdata._id == value._id) {
                        $scope.editproduct.productRelations[key] = relationdata;
                        $scope.updateitem($scope.editproduct);


                    }

                });
            } else {
                $scope.editproduct.productRelations.push(angular.copy(relationdata));
                $scope.updateitem($scope.editproduct);
                $scope.prelation = {
                    descriptions: [{
                        language: 'en',
                        description: ''
                    }]
                };
                $scope.selectedlang = ['en'];
            }

        }



        $scope.editprelation = function(editcproductdata) {

            $scope.nproductvar = true;
            $scope.selectedlang=[];
            $scope.prelation = angular.copy(editcproductdata);
            $scope.editlang();

        }




        $scope.deleteprelation = function() {
            for (var i = $scope.editproduct.productRelations.length - 1; i >= 0; i--) {
                if ($scope.editproduct.productRelations[i].checked == true)
                    $scope.editproduct.productRelations.splice(i, 1);
            };
            $scope.updateitem($scope.editproduct);

            $scope.prelation = {
                descriptions: [{
                    language: 'en',
                    description: ''
                }]
            };
            $scope.selectedlang = ['en'];

        }


        $scope.isprelationAll = false;

        $scope.selectAllprelationCBoxes = function() {
            if ($scope.isprelationAll === false) {
                angular.forEach($scope.editproduct.productRelations, function(checkbox) {
                    checkbox.checked = true;

                });

                $scope.isprelationAll = true;

            } else {
                angular.forEach($scope.editproduct.productRelations, function(checkbox) {
                    checkbox.checked = false;
                });
                $scope.isprelationAll = false;
            }
        }

        // add remove description text box


        $scope.addContact = function() {
            $scope.contacts.push({
                type: 'email',
                value: 'yourname@example.org'
            });
        };

        $scope.removeContact = function(contactToRemove) {
            var index = $scope.contacts.indexOf(contactToRemove);
            $scope.contacts.splice(index, 1);
        };

        $scope.openChannelDetails = function(size,data) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent9.html',
                    controller: ChannelDetailsModalInstanceCtrl,
                    size: size,
                    resolve: {
                        channel_details:function(){
                            return data;
                        }
                    }
                });

                modalInstance.result.then(function(variant_data) {
                    $scope[resmodel].variantId = variant_data.variantId;
                });
        }

        //search variant

        $scope.openVariant = function(size,which,resmodel) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent6.html',
                    controller: VariantModalInstanceCtrl,
                    size: size,
                    resolve: {
                        data:function(){
                            return which;
                        }
                    }
                });

                modalInstance.result.then(function(variant_data) {
                    $scope[resmodel].variantId = variant_data.variantId;
                });
            }
        // search classification modal

        $scope.openClassification = function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrl,
                    size: size,
                    resolve: {

                    }
                });

                modalInstance.result.then(function(cid) {
                    $scope.description = cid.descriptions;
                    $scope.classification_id = cid;
                    $scope.createNew = {
                        "classificationId": cid.classificationId,
                        "classificationRef": cid._id

                    }
                });
            }

        //search classificationGroup

        $scope.openClassificationGroup = function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent1.html',
                    controller: ClassificationGroupCtrl,
                    size: size,
                    resolve: {
                        cid_detail: function() {
                            return $scope.classification_id;
                        }
                    }
                });
                modalInstance.result.then(function(cid) {
                    $scope.classificationGroupDescription = cid.descriptions;
                    $scope.createNew.classificationGroupId = cid.classificationGroupId;
                });
            };

//Attribute search modal 

		    $scope.openAttribute= function(size) {
                 var deferred = $q.defer();
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent2.html',
                    controller: AttributeCtrl,
                    size: size
                });
                modalInstance.result.then(function(attributedata) {
                	// $scope.attributeDetails = attributedata;
                	$scope.doc = attributedata;
                	$scope.doc.attribute = attributedata._id;
                    deferred.resolve(attributedata);
                },
            function() {
                // $scope.editProfile=editProfileBeforeCancle;
                // $log.info('Modal dismissed at: ' + new Date());
                    deferred.reject('rjected');
                
            });
            return deferred.promise;
            }


       // Add channel
        $scope.channels =[];

        $scope.addChannel = function(size) {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent8.html',
                    controller: ChannelModalInstanceCtrl,
                    size: size
                });

                modalInstance.result.then(function(channel_data) {
                    $scope.channels.push(channel_data);
                    
                });
        }
//Edit Attribute
	$scope.editAttribute = function(id){
		window.open('http://classificationattribute-44842.onmodulus.net/#/attribute/' +id, '_blank', 'toolbar=0,location=0,menubar=0');
	}

    // $scope.editAttribute = function(id){
    //     $http.get('/getConfig')
    //     .then(function(result) {
    //           $scope.result = result.data;
    //             editAttribute1(id);

    //         })
    //         .catch(function(err) {
    //             console.log('error')
    //         })
    // }

    // var editAttribute1 = function(id){
    //     $http.get($scope.result +'/getClassificationAttributeHost/')
    //          .then(function(result) {
    //           $scope.result = result.data;
    //           window.open($scope.result+'/#/attribute/' +id, '_blank', 'toolbar=0,location=0,menubar=0');
                
    //         })
    //         .catch(function(err) {
    //             console.log('error')
    //         })
    // }

    }
]);


//channel modal controller



//variant modal controller

var VariantModalInstanceCtrl = function($scope, $modalInstance, $http, $location,data) {
    $scope.searchVariants = function(requestdata) {
        var a={};
        var b=data;
        a[b]=true;
        if(requestdata)
            a['variantId'] = requestdata.variantId;
        $http.post('/getVariants',a)
            .then(function(result) {
                $scope.getVariantsList = result.data;

            })
            .catch(function(err) {
                console.log('error')
            })
    }

    $scope.getVariant = function(cid) {
        $modalInstance.close(cid);
    }
    
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };

    // searchVariants();
};
//modal for classification
var ModalInstanceCtrl = function($scope, $modalInstance, $http, $location) {
    $scope.searchClassification = function(reqData) {
        $http.get('/getConfig')
            .then(function(result) {
                $scope.result = result.data;
                postClassification(reqData);

            })
            .catch(function(err) {
                console.log('error')
            })
    }
    var postClassification = function(rqstData) {

        $http.post($scope.result + '/api/classificationSearch', rqstData)
            .then(function(result) {
                $scope.details = result.data;
                $scope.currentPage = 0;
				$scope.groupToPages();
            })
            .catch(function(err) {
                console.log('error')
            })
    }

    $scope.getClassification = function(cid) {
        $modalInstance.close(cid);
    }


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
		$scope.filteredItems = $scope.details;
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

	    $scope.pagedItems = [];
		$scope.currentPage = 0;
		$scope.filteredItems = [];
	 	$scope.itemsPerPage = 10;
	 	$scope.min = 0;
	 	$scope.max =5;
		$scope.groupToPages();

    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };
};

//modal for classificationGroup
var ClassificationGroupCtrl = function($scope, $modalInstance, $http, $location, cid_detail) {
    $scope.cIdDetail = {
        "classificationRef": cid_detail._id
    };

    $scope.classificationId = cid_detail.classificationId;
    var _scope = {};
    _scope.init = function() {
        $scope.searchClassificationGroup();
    }
    $scope.searchClassificationGroup = function() {
        $http.get('/getConfig')
            .then(function(result) {
                $scope.result = result.data;
                postClassificationGroup($scope.cIdDetail);

            })
            .catch(function(err) {
                console.log('error')
            })
    }

    var postClassificationGroup = function(cid) {
        $http.post($scope.result + '/api/classificationGroupSearch', cid)
            .then(function(result) {
                $scope.classificationGroupdetails = result.data;
                 $scope.currentPage = 0;
				 $scope.groupToPages();

            })
            .catch(function(err) {
                console.log('error')
            })
    }

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
		if ($scope.currentPage < $scope.groupItems.length - 1) {
			$scope.currentPage++;
		}
		$scope.limit = $scope.groupItems.length;
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
		$scope.groupItems = [];
		$scope.filteredItems = $scope.classificationGroupdetails;
		$scope.filtered();
	};

	$scope.filtered = function () {
			if($scope.filteredItems){
				for (var i = 0; i < $scope.filteredItems.length; i++) {
					if (i % $scope.itemsPerPage === 0) {
						$scope.groupItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
					}
					else {
						$scope.groupItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
					}
				}
			}   
	};

	    $scope.groupItems = [];
		$scope.currentPage = 0;
		$scope.filteredItems = [];
	 	$scope.itemsPerPage = 5;
	 	$scope.min = 0;
	 	$scope.max =5;
		$scope.groupToPages();
    $scope.getClassificationGroup = function(cid) {
        $modalInstance.close(cid);
    }
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };
    _scope.init();
};


//controller for Attribute modal

var AttributeCtrl = function($scope, $modalInstance, $http, $location,$modal) {
    $scope.searchAttribute = function(reqData) {
        $http.get('/getConfig')
            .then(function(result) {
                $scope.result = result.data;
                postAttribute(reqData);

            })
            .catch(function(err) {
                console.log('error')
            })
    }
    var postAttribute = function(rqstData) {
        $http.post($scope.result + '/api/attributeSearch', rqstData)
            .then(function(result) {
                $scope.attrdetails = result.data;
                $scope.currentPage = 0;
				$scope.groupToPages();
            })
            .catch(function(err) {
                console.log('error')
            })
    }

    	//attribute section modal
        $scope.attributeSection= function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent3.html',
                    controller: AttributeSectionCtrl,
                    size: size
                });
                modalInstance.result.then(function(attrsectiondata) {
                	$scope.attrsectionData = attrsectiondata;
                	$scope.attrID = {
                        "sectionRef": attrsectiondata.attributeSectionId
                    }
                });
            },
            function() {
                // $scope.editProfile=editProfileBeforeCancle;
                // $log.info('Modal dismissed at: ' + new Date());

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
		if ($scope.currentPage < $scope.groupItems.length - 1) {
			$scope.currentPage++;
		}
		$scope.limit = $scope.groupItems.length;
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
		$scope.groupItems = [];
		$scope.filteredItems = $scope.attrdetails;
		$scope.filtered();
	};

	$scope.filtered = function () {
			if($scope.filteredItems){
				for (var i = 0; i < $scope.filteredItems.length; i++) {
					if (i % $scope.itemsPerPage === 0) {
						$scope.groupItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
					}
					else {
						$scope.groupItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
					}
				}
			}   
	};

	    $scope.groupItems = [];
		$scope.currentPage = 0;
		$scope.filteredItems = [];
	 	$scope.itemsPerPage = 5;
	 	$scope.min = 0;
	 	$scope.max =5;
		$scope.groupToPages();
    $scope.getAttribute = function(cid) {
        $modalInstance.close(cid);
    }
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };
};


//attribute section controller
var AttributeSectionCtrl = function($scope, $modalInstance, $http, $location) {
    $scope.searchSection = function(reqData) {
        $http.get('/getConfig')
            .then(function(result) {
                $scope.result = result.data;
                postSection(reqData);

            })
            .catch(function(err) {
                console.log('error')
            })
    }
    var postSection = function(rqstData) {
        $http.post($scope.result + '/api/attributeSectionSearch', rqstData)
            .then(function(result) {
                $scope.attrsectiondetails = result.data;
                $scope.currentPage = 0;
				$scope.groupToPages();
            })
            .catch(function(err) {
                console.log('error')
            })
    }




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
		if ($scope.currentPage < $scope.groupItems.length - 1) {
			$scope.currentPage++;
		}
		$scope.limit = $scope.groupItems.length;
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
		$scope.groupItems = [];
		$scope.filteredItems = $scope.attrsectiondetails;
		$scope.filtered();
	};

	$scope.filtered = function () {
			if($scope.filteredItems){
				for (var i = 0; i < $scope.filteredItems.length; i++) {
					if (i % $scope.itemsPerPage === 0) {
						$scope.groupItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
					}
					else {
						$scope.groupItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
					}
				}
			}   
	};

	    $scope.groupItems = [];
		$scope.currentPage = 0;
		$scope.filteredItems = [];
	 	$scope.itemsPerPage = 5;
	 	$scope.min = 0;
	 	$scope.max =5;
		$scope.groupToPages();
    $scope.getAttributeSection = function(cid) {
        $modalInstance.close(cid);
    }
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };
};

var ChannelModalInstanceCtrl = function($scope, $modalInstance, $http, $location,$controller) {
   var testCtrl1ViewModel = $scope.$new(); 
   $scope.channelinfo = {};
$scope.openChannelModal =function(){
    $controller('EditProductCtrl',{$scope : testCtrl1ViewModel ,$modalInstance:$modalInstance});
    testCtrl1ViewModel.openAttribute().then(function(){
         $scope.channelinfo.attribute=testCtrl1ViewModel.doc.attributeId;
         $scope.channelinfo.attributeid=testCtrl1ViewModel.doc.attribute;
    })
   
   
}

$scope.addChannelRow = function(channel_info){
    $modalInstance.close(channel_info);
}
    
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };


}


var ChannelDetailsModalInstanceCtrl = function($scope, $modalInstance, $http, $location,channel_details) {
    var getDetails = function() {
        $scope.getChannelDetails = channel_details.channels;
    }
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    };

    getDetails();
};