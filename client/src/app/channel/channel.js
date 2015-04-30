myApp.controller('ChannelCtrl',['$scope','$controller','$http','getProductData','growl',function($scope,$controller,$http,getProductData,growl){

	var _scope={};
	$scope.channeldata={};
	$scope.createNewChannel=function(){
		$scope.showChannel=true;
		$scope.channeldata={channel:[{key:''}],tenantId:'',channelId:'',attribute:'',language:'en'}
	}

	$scope.searchAttributes=function(size){
		var testCtrl1ViewModel = $scope.$new();
	    $controller('EditProductCtrl',{$scope : testCtrl1ViewModel});
	    testCtrl1ViewModel.openAttribute(size).then(function(data){
	         $scope.channeldata.attribute=data.attributeId;
	    })
    }

    $scope.addNewChannel=function(newChannel){
    	angular.forEach(newChannel.channel,function(vals,keys){
        
        newChannel.channel[keys]=vals.key;
    });
    	getProductData.createChannel(newChannel)
    		.then(function(data){
    			growl.addSuccessMessage('Channel added succesfully');
    		})
    		.catch(function(error){
    			console.log(error);
    		})
    }

    $scope.addChannelName=function(){
	    $scope.channeldata.channel.push({key:''})
	}


}]);