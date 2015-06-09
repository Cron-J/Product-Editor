myApp.controller('mainCtrl', [ '$scope','$location','$rootScope','$timeout',
	function($scope,$location,$rootScope,$timeout){
		$scope.changeView={search:false};
		$scope.changeView={attributeShow:false};
		$scope.changeView={classificationShow:false};
		$scope.changeView={classificationGroupShow:false};
		$scope.searchVar={value:false};
		$scope.masterCheck={value:false};
		$scope.itemsPerPage = 10;

		$scope.moveToProdList = function(){
            $location.path('/');
            $timeout(function(){
			   $scope.$broadcast('productList','success');
			});
            
         }
}]);