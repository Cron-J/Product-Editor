myApp.controller('variantCtrl', [ '$scope','$rootScope', 
 '$http','$location','growl','$modal','$routeParams','$filter',
 'blockUI',
 function($scope,$rootScope, $http, $location,
  growl, $modal, $routeParams, blockUI,$filter){

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


  $scope.updatevariant = function(editedvariant) {


            $http.put('/updateVariant/' + editedvariant._id, editedvariant)
                .success(function(status, data) {
                    console.log(data);
                });

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