myApp.factory('attribute', ['$resource', function($resource) {
	var baseUrl="/api/";
	return $resource(baseUrl+':url/:id/:attribute_id', {},
		{
			'update': { method:'PUT' },
			'save': {method: 'POST', isArray:false} ,
			'searchQuery': { method: 'POST', isArray: true },
			'query': { isArray: true},
			'delet': {method: 'DELETE' }
		});
}]);