
myApp.controller('EditProductCtrl', ['$scope', '$rootScope','$http', '$location', 'growl', '$modal', '$routeParams', '$filter','blockUI','$q','uiGridConstants','$timeout','$interval','getProductData',
    function($scope, $rootScope, $http, $location, growl, $modal, $routeParams, $filter,blockUI,$q,uiGridConstants,$timeout,$interval,getProductData) {
        
        /*update or add product data*/
        $scope.variantAttrList=[];
        $scope.updateitem = function(editproduct,type) {
            getProductData.updateProduct(editproduct)
                .then(function(data){
                    if(type=='New_Variant'){
                        growl.addSuccessMessage('Variant created succesfully');
                        $scope.newvariant=null;
                    }
                    else if(type=='Edit_Variant'){
                        // $scope.product.variants.indexOf($scope.editvariant)
                        growl.addSuccessMessage('Variant updated succesfully');
                        
                    }
                    else if(type!=='delete'){
                        growl.addSuccessMessage('Attribute list updated succesfully');
                    }
                    else if(type=='delete'){
                        growl.addSuccessMessage('Attribute deleted succesfully');
                    }

                    //$scope.updateVariantList();
                })
                .catch(function(error){

                })
        }

        /*sub program of update or add product data in the case of ui-grid*/
        $scope.updategrid=function(type){
            $scope.editproduct.attributeValues=$scope.data;
            $scope.updateitem($scope.editproduct,type);
        }

        $scope.cancel = function() {
            $location.path('/');
        }

       /*get product data*/
        var init = function() {
            
            $q.all([getProductData.getProducts($routeParams.id)
                .then(function(data){

                    $scope.editproduct = data.data;
                    console.log('$scope.editproduct',$scope.editproduct)
                     $scope.updateVariantList('hasVariantAttributeValues');
                })
            ])
            .then(function(values){
                editAttribute();
            })
        }
        $scope.hasVariantAttributeValues=[];
        /*generic code for showing variant in each tab*/
         $scope.updateVariantList=function(variantType){
             $scope[variantType] ? $scope[variantType].length=0 :$scope[variantType]=[];
             //$scope[variantType].length=0;
            //$scope.mk.length=0;
                angular.forEach($scope.editproduct.variants,function(value,key){
                    if(value[variantType]==true){
                        $scope[variantType].push({label:value.variantId,value:value.variantId})
                    }
                })
           
            

        }

        init();

        // Preview Button Show hide
        $scope.previewvar = true;
        $scope.showhidepreview = function() {
            $scope.previewvar = false;
        }

        /*datepicker initializer */

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

        $scope.cancelGrp = function(){
            $scope.showvar = false;
        }

        $scope.editvar = false;

        $scope.editGrp = function(data) {
            $scope.editrow = data;
            $scope.editvar = true;
            $scope.showvar = false;
        }

        $scope.canceleditGrp = function(data) {
            $scope.editvar = false;
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

        /*Search Product*/
        $scope.searchProduct=function(size,productKey){
             var modalInstance = $modal.open({
              templateUrl: 'productsearch.html',
              controller: 'SearchProductCtrl',
              size: size,
              resolve: {
                SearchProductKey: function () {
                  return productKey;
                }
              }
            });

            modalInstance.result.then(function (choosedProduct) {
                $scope.prelation= $scope.prelation ? $scope.prelation : {};
              $scope.prelation.relatedProductId = choosedProduct.productId;
            }, function () {
              
            });
          

            
        }


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
        /*get module linkup url*/
        var editAttribute = function(id){
        $http.get('/getConfig')
        .then(function(result) {
              $scope.moduleLinkupUrl = result.data;
              getAttributeData();
            })
            .catch(function(err) {
                console.log('error')
            })
        }
        
/*ui-grid implementation*/

        /*popup modal for show and add channel*/
        $scope.showChannel=function(channelIndex){
            
            var channels=$scope.data[channelIndex].channels;
            var modalInstance = $modal.open({
              templateUrl: 'channelContent.html',
              controller: 'ChannelCtrl',
              size:'lg',
              resolve: {
                channel_details: function () {
                  return channels;
                }
              }
            });

            modalInstance.result.then(function (getChannelDetails) {
                $scope.data[channelIndex].channels=getChannelDetails;
              
            }, function () {
              console.log('error');
            });

        }
        /*initilize ui-grid data*/

        $scope.data = [];
        var attribute_ids=[];
        $scope.firstPage = 0;
        $scope.lastPage = 0;
        var rowtoshow=12;

        /*ui-grid option and column decription*/
        $scope.gridOptions={
            enableFiltering: true,
            enableGridMenu : true,
            enableRowSelection: true,
            enableSelectAll: true,
            lateBoundColumns :true,
            selectionRowHeaderWidth: 50,
            // rowHeight: 35,
            // infiniteScrollRowsFromEnd: 50,
            // infiniteScrollUp: true,
            infiniteScrollDown: true,
            columnDefs : [
                { displayName:"Attribute",field: 'attribute',cellTemplate: '<div class="ui-grid-cell-contents"  ng-dblclick="grid.appScope.openAttributes(rowRenderIndex)" title="TOOLTIP">{{COL_FIELD }}</div>',enableCellEdit: false, filter: {placeholder: 'Search Attribute'}},
                { displayName:"Section",field: 'sectionRef.attributeSectionId' ,filter: {placeholder: 'Search Section'}},
                { displayName:"Type",field: 'types[0]',filter: { placeholder: 'Search Types'} },
                { displayName:"Order No.",field: 'orderNro',filter: { placeholder: 'Search Order No'} },
                { displayName:"Value",field: 'value' ,filter: {placeholder: 'Search Value'}},
                { displayName:"Status Ids", field:"statusId", editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'status',
                    cellFilter: 'formatStatus',
                    filter: {  placeholder: 'Search Order No', type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            { label: '080 error', value: '080'},
                            { label: '090 warning'                , value: '090'},
                            { label: '100 new'                    , value: '100'},
                            { label: '105 changed'                , value: '105'},
                            { label: '200 checked'                , value: '200'},
                            { label: '225 translate'              , value: '225'},
                            { label: '250 Translation needed'     , value: '250'},
                            { label: '275 Translation in progress', value: '275'},
                            { label: '300 waiting'                , value: '300'},
                            { label: '350 translate '             , value: '350'},
                            { label: '400 confirmed'              , value: '400'},
                            { label: '420 Immediate'              , value: '420'},
                            { label: '700 temporary'              , value: '700'},
                            { label: '800 deleted'                , value: '800'}
                        ]
                    },
                    editDropdownOptionsArray: [
                        { status: '080 error'                  , id: '080'},
                        { status: '090 warning'                , id: '090'},
                        { status: '100 new'                    , id: '100'},
                        { status: '105 changed'                , id: '105'},
                        { status: '200 checked'                , id: '200'},
                        { status: '225 translate'              , id: '225'},
                        { status: '250 Translation needed'     , id: '250'},
                        { status: '275 Translation in progress', id: '275'},
                        { status: '300 waiting'                , id: '300'},
                        { status: '350 translate '             , id: '350'},
                        { status: '400 confirmed'              , id: '400'},
                        { status: '420 Immediate'              , id: '420'},
                        { status: '700 temporary'              , id: '700'},
                        { status: '800 deleted'                , id: '800'}

                    ]
                },

                { displayName:"Uom",field: 'unitOfMeasure',filter: { placeholder: 'Search Uom'} },
                
                { displayName:"Language", field:"languageId", editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'language',
                    filter: {  placeholder: 'Search language', type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            { label: 'de', value: 'de'},
                            { label: 'en', value: 'en'},
                            { label: 'es', value: 'es'},
                            { label: 'fr', value: 'fr'},
                            { label: 'jp', value: 'jp'}
                        ]
                    },
                    editDropdownOptionsArray: [
                        { language: 'de', id: 'de'},
                        { language: 'en', id: 'en'},
                        { language: 'es', id: 'es'},
                        { language: 'fr', id: 'fr'},
                        { language: 'jp', id: 'jp'}

                    ] 
                },
                { displayName:"Variant Id", field:"variantId",filter: {placeholder: 'Search variant id'}, editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownIdLabel:'value', editDropdownValueLabel: 'label',
                    filter: { placeholder: 'Search variant', type: uiGridConstants.filter.SELECT, 
                              selectOptions : $scope.hasVariantAttributeValues
                            },
                    editDropdownOptionsArray : $scope.hasVariantAttributeValues
                },

                { displayName:"Channels",field: 'channels', cellTemplate:'<button class="btn btn-primary btn-xs centered" ng-click="grid.appScope.showChannel(rowRenderIndex)"><span class="glyphicon glyphicon-list-alt"></span></button>' , filter: { placeholder: 'Search channel'} },
            ],
            data: 'data',
            onRegisterApi: function(gridApi){
                gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
                gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.getDataUp);
                $scope.gridApi = gridApi;
                $interval( function() {
                    $scope.gridApi.core.handleWindowResize();
                }, 10, 100);
            }
        };

         
        /*load ui-grid data at first time*/
          $scope.getFirstData = function() {
            var promise = $q.defer();
            var curr_attributeValues=[];
             $scope.attributeValues=angular.copy($scope.editproduct.attributeValues);
             curr_attributeValues=$scope.attributeValues.slice($scope.lastPage*rowtoshow,($scope.lastPage+1)*rowtoshow);
             angular.forEach(curr_attributeValues,function(value,key){
                attribute_ids.push(value.attribute);
             })
            
            $http.post($scope.moduleLinkupUrl+'/api/attributeList',{"attributeIds":attribute_ids})
            .success(function(data) {
            angular.forEach(curr_attributeValues,function(val,key){
                angular.forEach(data,function(val1,key1){
                    if(val.attribute==val1.attributeId){
                        var object = angular.extend({}, val, val1);
                        curr_attributeValues[key]=object;
                    }
                })
            })

              var attrdata = curr_attributeValues;
              $scope.data = $scope.data.concat(attrdata);
              promise.resolve();
            });
            return promise.promise;
          };

        /*load ui-grid data at after first time*/
          $scope.getDataDown = function() {
            if($scope.data.length<$scope.editproduct.attributeValues.length){
             var promise = $q.defer();
             var attribute_ids=[];
             $scope.lastPage++;
             var curr_attributeValues=[];
             curr_attributeValues=$scope.attributeValues.slice($scope.lastPage*rowtoshow,($scope.lastPage+1)*rowtoshow);
             angular.forEach(curr_attributeValues,function(value,key){
                attribute_ids.push(value.attribute);
             })

            $http.post($scope.moduleLinkupUrl+'/api/attributeList',{"attributeIds":attribute_ids})
            .success(function(data) {
              angular.forEach(curr_attributeValues,function(val,key){
                angular.forEach(data,function(val1,key1){
                    if(val.attribute==val1.attributeId){
                        var object = angular.extend({}, val, val1);
                        curr_attributeValues[key]=object;
                    }
                })
            })
              var attrdata = curr_attributeValues;
              $scope.gridApi.infiniteScroll.saveScrollPercentage();
              $scope.data = $scope.data.concat(attrdata);
              $scope.gridApi.infiniteScroll.dataLoaded($scope.firstPage > 0, $scope.lastPage < 4).then(function() {}).then(function() {
                promise.resolve();
              });
            })
            .error(function(error) {
              $scope.gridApi.infiniteScroll.dataLoaded();
              promise.reject();
            });
            return promise.promise;
            }
          };

          $scope.getPage = function(data, page) {
            var res = [];
            for (var i = (page * rowtoshow); i < (page + 1) * rowtoshow && i < data.length; ++i) {
              res.push(data[i]);
            }
            return res;
          };

          function getAttributeData(){
            $scope.getFirstData().then(function(){
            $timeout(function() {
              // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
              // you need to call resetData once you've loaded your data if you want to enable scroll up,
              // it adjusts the scroll position down one pixel so that we can generate scroll up events 
              $scope.gridApi.infiniteScroll.resetScroll( $scope.firstPage > 0, $scope.lastPage < 4 );
            });
          });
          }

          $scope.addNewAttribute=function(){
            $scope.data.unshift({button:true});
          }
          $scope.deleteAttribute=function(){
            angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
                $scope.data.splice($scope.data.lastIndexOf(data), 1);
            });
            $scope.updategrid('delete');
          }

          $scope.resizewindow=function(){
             $interval( function() {
                $scope.gridApi.core.handleWindowResize();
              }, 10, 500);
          }
          
        // Document Tab


        $scope.docvar = false;
        $scope.createdoc = function() {
            $scope.docvar = true;
            $scope.doc = {};
        }

        $scope.canceldoc = function() {
            $scope.docvar = false;
        }
        

        $scope.savedoc = function(docdata) {
            if (docdata._id) {
                angular.forEach($scope.editproduct.documents, function(value, key) {
                    if (docdata._id == value._id) {
                        $scope.editproduct.documents[key] = docdata;
                        $scope.updateitem($scope.editproduct);
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

        // Document tab function End

        $scope.doc = {};


        // Price tab function Start

        $scope.pricevar = false;

        $scope.newprice = function() {

            $scope.pricevar = true;
            $scope.price = {};

        }

        $scope.cancelprice = function() {

            $scope.pricevar = false;
        }

        // Accordion tab

        $scope.status = {
            isFirstOpen: true,
        };



        $scope.saveprice = function(pricedata) {

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


        $scope.cancelcproduct = function() {

            $scope.cproductvar = false;

        }

        $scope.savecproduct = function(cproductdata) {

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

        $scope.cancelrelation = function() {

            $scope.nproductvar = false;
            

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
                $scope.prelation={};
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

        /*Variant Tab Code*/
        $scope.newvariant={};
        $scope.editvariant
        $scope.searchvariant = function(variantdata){
            getProductData.searchVariant(variantdata)
               .then(function (data,status){
                    $scope.tabledata= data;
                })
               .catch(function(error){
                    console.log(error);
               })
          }

        $scope.assignvariant = function (){
             $scope.showvar=true;
             $scope.editvar=false;
             $scope.createNew={};
        }

        $scope.addAttributes= function(type) {
            $scope.openAttribute('lg').then(function(data){
                if(type == 'new'){
                    console.log('mk',data)
                    $scope.newvariant.attributes=data.attribute;
                }
                else{
                    $scope.editvariant.attributes=data.attribute;
                }
            })
            .catch(function(error) {
                console.log(error)
            })
        }
        $scope.addNewVariant=function(newvariant){
            $scope.editproduct.variants.push(newvariant);
            $scope.updateitem($scope.editproduct,'New_Variant');
            $scope.showvar=false;
        }

        $scope.updatevariant=function(){
            $scope.updateitem($scope.editproduct,'Edit_Variant');
            $scope.editvar=false;
        }

        



        // add remove description text box
        $scope.editvariants = function (data){
            $scope.editvariant=data;
            $scope.editvar=true;
            $scope.showvar=false;
        }

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

        // $scope.openChannelDetails = function(size,data) {
        //         var modalInstance = $modal.open({
        //             templateUrl: 'myModalContent9.html',
        //             controller: ChannelDetailsModalInstanceCtrl,
        //             size: size,
        //             resolve: {
        //                 channel_details:function(){
        //                     return data;
        //                 }
        //             }
        //         });

        //         modalInstance.result.then(function(variant_data) {
        //             $scope[resmodel].variantId = variant_data.variantId;
        //         });
        // }

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

                	$scope.doc.attribute = attributedata.attributeId;
                    deferred.resolve(attributedata);
                },
            function() {
                // $scope.editProfile=editProfileBeforeCancle;
                // $log.info('Modal dismissed at: ' + new Date());
                    deferred.reject('rjected');
                
            });
            return deferred.promise;
            }

            $scope.openAttributes= function(index) {
                 $scope.openAttribute('lg').then(function(data){
                    $scope.data[index].attribute=data.attribute;
                    $scope.data[index].button=false;
                    $http.post($scope.moduleLinkupUrl+'/api/attributeList',{"attributeIds":[data.attribute]})
                    .success(function(data) {
                      angular.extend($scope.data[index],data[0]);
                    })
                    .error(function(error) {
                        console.log(error)
                    })
            })}


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


//modal controller for classification
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


//modal Controller for classificationGroup
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


// var ChannelDetailsModalInstanceCtrl = function($scope, $modalInstance, $http, $location,channel_details) {
//     var getDetails = function() {
//         $scope.getChannelDetails = channel_details.channels;
//     }
//     $scope.cancel = function() {

//         $modalInstance.dismiss('cancel');

//     };

//     getDetails();
// };

/*popup modal for view and add channel of an attribute*/

myApp.controller('ChannelCtrl', function ($scope, $modalInstance,channel_details,$controller) {
  $scope.getChannelDetails = channel_details ? channel_details: [];
  $scope.channeldata={};
  $scope.showPagination=true;
  var testCtrl1ViewModel = $scope.$new();
  $scope.searchAttributes=function(){
    $controller('EditProductCtrl',{$scope : testCtrl1ViewModel ,$modalInstance:$modalInstance});
    testCtrl1ViewModel.openAttribute().then(function(data){
         $scope.channeldata.attribute=data.attributeId;
    })
  }
  $scope.addChannel=function(){
    $scope.showChannelField=true;
    $scope.channeldata={attribute:'',channel:[{key:''}],language:'en',value:''};
  }
  $scope.addChannelName=function(){
    $scope.channeldata.channel.push({key:''})
  }
  $scope.addChannelToList=function(){
    $scope.showChannelField=false;
    $scope.getChannelDetails.push($scope.channeldata)
  }
  $scope.ok = function () {
    angular.forEach($scope.channeldata.channel,function(vals,keys){
        
        $scope.channeldata.channel[keys]=vals.key;
    });
    $modalInstance.close($scope.getChannelDetails);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});


myApp.controller('SearchProductCtrl', function ($scope, $modalInstance, SearchProductKey,getProductData) {


  function init(){
    getProductData.searchProduct(SearchProductKey)
        .then(function (data) {
            $scope.productList=data.data;
            //$scope.totalItems = $scope.productList.length;
            // $scope.itemsPerPage = 10;
            // $scope.currentPage = 1;
        })
        .catch(function(error){
            console.log('error');
        })
  }

  $scope.chooseProduct = function (choosedProduct) {
    $modalInstance.close(choosedProduct);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  init();
});
