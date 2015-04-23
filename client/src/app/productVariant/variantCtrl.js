myApp.controller('variantCtrl', [ '$scope','$rootScope', 
 '$http','$location','growl','$modal','$routeParams','$filter',
 'blockUI','$q',
 function($scope,$rootScope, $http, $location,
  growl, $modal, $routeParams, blockUI,$filter,$q){
  
$scope.newvariant={};
  $scope.create = function(variantinfo){

   $http.post('/createVariant',variantinfo)
   .success(function (data,status){
    console.log(variantinfo);
   });

  }

  $scope.searchvariant = function(variantdata){

   $http.post('/getVariants',variantdata)
   .success(function (data,status){
    $scope.tabledata= data;
   });

  }

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

    $scope.groupToPages = function () {
      $scope.groupItems = [];
      $scope.filteredItems = $scope.attrdetails;
      $scope.filtered();
    };
    $scope.itemsPerPage=5;
    $scope.min = 0;
    $scope.max =5;
    // $scope.groupToPages();
    $scope.getAttribute = function(cid) {
        $modalInstance.close(cid);
    }
    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');

    }
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

}
  $scope.updatevariant = function(editedvariant) {


            $http.put('/updateVariant/' + editedvariant._id, editedvariant)
                .success(function(status, data) {
                    console.log(data);
                });

        }


$scope.cancelvariant = function(){

    $scope.showvar=false;

}


$scope.cancelupvariant = function(){

    $scope.editvar=false;

}


  $scope.cancel = function(){
   $location.path('/');
  }



   var init = function(){
    var urlBase = '/getVariants';
    $http.post(urlBase)
     .then(function(result) {
       $scope.tabledata = result.data;
       
    })
     .catch(function(err){
      console.log('error')
     })
   }


   init();

  // $scope.fetchProductData = function(){

  //  $scope.editproduct = getProductDataFactory.getlocalData();
   
  // }


  // Preview Button Show hide

  $scope.previewvar=true;


  $scope.showhidepreview = function (){

   $scope.previewvar=false;
   


  }



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




            $scope.openAttributes= function(type) {

                 $scope.openAttribute('lg').then(function(data){


                  if(type == 'new')
                      $scope.newvariant.attributes=data.attributeId;
                    
                    else
                      $scope.editvariant.attributes=data.attributeId;
                    })
                    .catch(function(error) {
                        console.log(error)
                    })
            }

            











 // Filter

   $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.search  = '';     // set the default search/filter term




    $scope.showvar=false;

    $scope.assignvariant = function (){
     $scope.showvar=true;
     $scope.editvar=false;
     $scope.createNew={};
    }


    $scope.editvar=false;

    $scope.editvariants = function (data){
     $scope.editvariant=data;
     $scope.editvar=true;
     $scope.showvar=false;
    }





  // $scope.newClsfnidGrp = function (createNewGrp){ 
  //     $scope.editproduct.classificationGroupAssociations.push(angular.copy(createNewGrp));
  //     $scope.updateitem($scope.editproduct);
  //     $scope.createNew={};
  // }


  // check Uncheck check boxes


  // $scope.isAll = false; 

  // $scope.selectAllcBoxes = function() {
         

  //           if($scope.isAll === false) {
  //     angular.forEach($scope.editproduct.classificationGroupAssociations, function(checkbox){
  //             checkbox.checked = true;

  //     });

  //        $scope.isAll = true; 
  //        } else {
  //        angular.forEach($scope.editproduct.classificationGroupAssociations, function(checkbox){
  //              checkbox.checked = false;
  //      });
  //        $scope.isAll = false; 
  //        }
  // }



  // delete item
  // $scope.deleteRow = function () {
  //  for (var i = $scope.editproduct.classificationGroupAssociations.length - 1; i >= 0 ; i--) {
  //   if($scope.editproduct.classificationGroupAssociations[i].checked == true)
  //    $scope.editproduct.classificationGroupAssociations.splice(i, 1);
  //  }; 
  //  $scope.updateitem($scope.editproduct);
  //  $scope.createNew={};
  // }


 }]);