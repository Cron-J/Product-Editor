myApp.controller('mainCtrl', [ '$scope',
	function($scope){
		$scope.changeView={search:false};
		$scope.changeView={attributeShow:false};
		$scope.changeView={classificationShow:false};
		$scope.changeView={classificationGroupShow:false};
		$scope.searchVar={value:false};
		$scope.masterCheck={value:false};
		$scope.itemsPerPage = 10;
}]);