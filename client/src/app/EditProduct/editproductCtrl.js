myApp.controller('EditProductCtrl', [ '$scope','$rootScope', 
	'$http','$location','growl','$modal','$routeParams','$filter',
	'blockUI',
	function($scope,$rootScope, $http, $location,
		growl, $modal, $routeParams, blockUI,$filter){

		 
	  // $scope.output={mk:[]};
	  


		$scope.updateitem = function(editproduct){


			$http.put('/updateProduct/'+editproduct._id ,editproduct)
			.success(function (status,data){
				console.log(data);
			});

		}

		$scope.cancel = function(){
			$location.path('/');
		}

		 var init = function(){
		 	var urlBase = '/getProduct/';
		 	$http.get(urlBase + $routeParams.id)
			  .then(function(result) {
			    $scope.editproduct = result.data;
			    
				})
			  .catch(function(err){
			  	console.log('error')
			  })

			   getOption();

		 }


		 init();

		  function getOption(){
		 	var urlBase = '/getVariants';
		 	$http.get(urlBase)
			  .then(function(result) {
			    $scope.options = result.data;
			    
				})
			  .catch(function(err){
			  	console.log('error')
			  })
		 }


		// $scope.fetchProductData = function(){

		// 	$scope.editproduct = getProductDataFactory.getlocalData();
			
		// }


		// Preview Button Show hide

		$scope.previewvar=true;


		$scope.showhidepreview = function (){

			$scope.previewvar=false;
			


		}

// datepicker

		$scope.date = {startDate: null, endDate: null};

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

 	$scope.sortType     = 'name'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order
  	$scope.search  = '';     // set the default search/filter term


// Product classification


		  $scope.showvar=false;

		  $scope.assignGrp = function (){
		  	$scope.showvar=true;
		  	$scope.editvar=false;
		  	$scope.createNew={};
		  }


		  $scope.editvar=false;

		  $scope.editGrp = function (data){
		  	$scope.editrow=data;
		  	// if(data.variantId){
		  	// 	$scope.editrow.variantId=parseInt(data.variantId);
		  	// }
		  	$scope.editvar=true;
		  	$scope.showvar=false;
		  }

		  // $scope.$watch('output.mk',function(){
		  // 	if($scope.output.mk.length>0)
		  // 	// $scope.search.variantId=$scope.output.mk[0].variantId;
		  // })
		  $scope.test=function(){
		  	console.log('sdsd');
		  }





		$scope.newClsfnidGrp = function (createNewGrp){ 
	    	$scope.editproduct.classificationGroupAssociations.push(angular.copy(createNewGrp));
	    	$scope.updateitem($scope.editproduct);
	    	$scope.createNew={};
		}


		// check Uncheck check boxes


		$scope.isAll = false;	

		$scope.selectAllcBoxes = function() {
        	

            if($scope.isAll === false) {
    		angular.forEach($scope.editproduct.classificationGroupAssociations, function(checkbox){
             	checkbox.checked = true;

    		});

	        $scope.isAll = true;	
	        } else {
	        angular.forEach($scope.editproduct.classificationGroupAssociations, function(checkbox){
	             	checkbox.checked = false;
	    		});
	        $scope.isAll = false;	
        	}
		}



		// delete item
		$scope.deleteRow = function () {
			for (var i = $scope.editproduct.classificationGroupAssociations.length - 1; i >= 0 ; i--) {
				if($scope.editproduct.classificationGroupAssociations[i].checked == true)
					$scope.editproduct.classificationGroupAssociations.splice(i, 1);
			};	
			$scope.updateitem($scope.editproduct);
			$scope.createNew={};
		}























   // Attribute Tab

   $scope.select={};
   $scope.hidecol=function(x){
   	console.log($scope.select.atrcolhide);
   }


































// Document Tab


		$scope.docvar=false;

		$scope.createdoc =  function(){

			$scope.docvar=true;
			$scope.doc={};

		}


		$scope.savedoc = function (docdata){

			// $scope.editproduct.documents.push(angular.copy(docdata));
			// $scope.updateitem($scope.editproduct);
			// console.log($scope.editproduct);
			if(docdata._id){
				angular.forEach($scope.editproduct.documents,function(value,key){

				if(docdata._id == value._id)
				{
					$scope.editproduct.documents[key] = docdata;
					$scope.updateitem($scope.editproduct);
					
					// console.log($scope.editproduct.documents);
					// console.log($scope.editproduct);
				}

				});
			}
			else{
				$scope.editproduct.documents.push(angular.copy(docdata));
				$scope.updateitem($scope.editproduct);
				$scope.doc={};
			}
		  
		}



		$scope.editdoc = function (editdocdata){

			$scope.docvar=true;

		  	$scope.doc = angular.copy(editdocdata); 	
		}



	  $scope.isdocAll = false;	

		$scope.selectAlldocCBoxes = function() {	
            if($scope.isdocAll === false) {
    		angular.forEach($scope.editproduct.documents, function(checkbox){
             	checkbox.checked = true;

    		});
    		
	        $scope.isdocAll = true;	

	        } 
	        else {
	        angular.forEach($scope.editproduct.documents, function(checkbox){
	             	checkbox.checked = false;
	    		});
	        $scope.isdocAll = false;	
        	}
		}



		// delete list
		$scope.deletedoc = function () {
			for (var i = $scope.editproduct.documents.length - 1; i >= 0 ; i--) {
				if($scope.editproduct.documents[i].checked == true)
					$scope.editproduct.documents.splice(i, 1);
			};	
			$scope.updateitem($scope.editproduct);
			$scope.doc={};

		}

		// $scope.selectedRow = function (id, value) {
		// 	console.log('//////////', id);
		// 	if(value) 
		// 		$scope.selectedId = id;
		// }


	// Document tab function End




	// Price tab function Start

	$scope.pricevar=false;

	$scope.newprice =  function(){

			$scope.pricevar=true;
			$scope.price={};

		}


	// Accordion tab

	 $scope.status = {
	    isFirstOpen: true,
	  };



	  $scope.saveprice = function (pricedata){

			// $scope.editproduct.documents.push(angular.copy(docdata));
			// $scope.updateitem($scope.editproduct);
			// console.log($scope.editproduct);
			if(pricedata._id){
				angular.forEach($scope.editproduct.prices,function(value,key){

				if(pricedata._id == value._id)
				{
					$scope.editproduct.prices[key] = pricedata;
					$scope.updateitem($scope.editproduct);
					
					
				}

				});
			}
			else{
				$scope.editproduct.prices.push(angular.copy(pricedata));
				$scope.updateitem($scope.editproduct);
				$scope.price={};
			}
		  
		}


		$scope.editprice = function (editpricedata){

			$scope.pricevar=true;

		  	$scope.price = angular.copy(editpricedata); 	
		}


		$scope.deleteprice = function () {
			for (var i = $scope.editproduct.prices.length - 1; i >= 0 ; i--) {
				if($scope.editproduct.prices[i].checked == true)
					$scope.editproduct.prices.splice(i, 1);
			};	
			$scope.updateitem($scope.editproduct);
			$scope.price={};

		}


		$scope.ispriceAll = false;	

		$scope.selectAllpriceCBoxes = function() {	
            if($scope.ispriceAll === false) {
    		angular.forEach($scope.editproduct.prices, function(checkbox){
             	checkbox.checked = true;

    		});
    		
	        $scope.ispriceAll = true;	

	        } 
	        else {
	        angular.forEach($scope.editproduct.prices, function(checkbox){
	             	checkbox.checked = false;
	    		});
	        $scope.ispriceAll = false;	
        	}
		}



	//Price tab function end 



// Contracted Product function start


	$scope.cproductvar=false;


	$scope.newcproduct =  function(){

		$scope.cproductvar=true;
		$scope.cproduct={};

	}




$scope.savecproduct = function (cproductdata){

			// $scope.editproduct.documents.push(angular.copy(docdata));
			// $scope.updateitem($scope.editproduct);
			// console.log($scope.editproduct);
			if(cproductdata._id){
				angular.forEach($scope.editproduct.contractedProducts,function(value,key){

				if(cproductdata._id == value._id)
				{
					$scope.editproduct.contractedProducts[key] = cproductdata;
					$scope.updateitem($scope.editproduct);
					
					
				}

				});
			}
			else{
				$scope.editproduct.contractedProducts.push(angular.copy(cproductdata));
				$scope.updateitem($scope.editproduct);
				$scope.cproduct={};
			}
		  
		}



		$scope.editcproduct = function (editcproductdata){

			$scope.cproductvar=true;

		  	$scope.cproduct = angular.copy(editcproductdata); 	
		}




		$scope.deletecproduct = function () {
			for (var i = $scope.editproduct.contractedProducts.length - 1; i >= 0 ; i--) {
				if($scope.editproduct.contractedProducts[i].checked == true)
					$scope.editproduct.contractedProducts.splice(i, 1);
			};	
			$scope.updateitem($scope.editproduct);
			$scope.cproduct={};

		}


$scope.iscproductAll = false;	

		$scope.selectAllcproductCBoxes = function() {	
            if($scope.iscproductAll === false) {
    		angular.forEach($scope.editproduct.contractedProducts, function(checkbox){
             	checkbox.checked = true;

    		});
    		
	        $scope.iscproductAll = true;	

	        } 
	        else {
	        angular.forEach($scope.editproduct.contractedProducts, function(checkbox){
	             	checkbox.checked = false;
	    		});
	        $scope.iscproductAll = false;	
        	}
		}




// Contracted product funcion end


// Product relation tab functions



	$scope.nproductvar=false;


	$scope.newprelation =  function(){

		$scope.nproductvar=true;
		$scope.prelation={};

	}




$scope.saverelation = function (relationdata){

			// $scope.editproduct.documents.push(angular.copy(docdata));
			// $scope.updateitem($scope.editproduct);
			// console.log($scope.editproduct);
			if(relationdata._id){
				angular.forEach($scope.editproduct.productRelations,function(value,key){

				if(relationdata._id == value._id)
				{
					$scope.editproduct.productRelations[key] = relationdata;
					$scope.updateitem($scope.editproduct);
					
					
				}

				});
			}
			else{
				$scope.editproduct.productRelations.push(angular.copy(relationdata));
				$scope.updateitem($scope.editproduct);
				$scope.prelation={};
			}
		  
		}



		$scope.editprelation = function (editcproductdata){

			$scope.nproductvar=true;

		  	$scope.prelation = angular.copy(editcproductdata); 	
		}




		$scope.deleteprelation = function () {
			for (var i = $scope.editproduct.productRelations.length - 1; i >= 0 ; i--) {
				if($scope.editproduct.productRelations[i].checked == true)
					$scope.editproduct.productRelations.splice(i, 1);
			};	
			$scope.updateitem($scope.editproduct);
			$scope.prelation={};

		}


$scope.isprelationAll = false;	

		$scope.selectAllprelationCBoxes = function() {	
            if($scope.isprelationAll === false) {
    		angular.forEach($scope.editproduct.productRelations, function(checkbox){
             	checkbox.checked = true;

    		});
    		
	        $scope.isprelationAll = true;	

	        } 
	        else {
	        angular.forEach($scope.editproduct.productRelations, function(checkbox){
	             	checkbox.checked = false;
	    		});
	        $scope.isprelationAll = false;	
        	}
		}

// add remove description text box
	

	 $scope.addContact = function() {
	    $scope.contacts.push({type:'email', value:'yourname@example.org'});
	  };

	  $scope.removeContact = function(contactToRemove) {
	    var index = $scope.contacts.indexOf(contactToRemove);
	    $scope.contacts.splice(index, 1);
	  };

	}]);



