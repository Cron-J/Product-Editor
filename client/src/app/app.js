'use strict';
// Declare app level module which depends on views, and components
var myApp = angular
	.module('myApp',['ngRoute', 'ngResource', 'ui.bootstrap', 'ngSanitize', 
		'angular-growl', 'ngDragDrop', 'angularjs-dropdown-multiselect','ui.select', 
		'ui.tree', 'ui.grid','ui.grid.moveColumns','ui.grid.edit', 'ui.grid.resizeColumns',
		'ui.grid.grouping','ui.grid.infiniteScroll','ui.grid.selection','ui.grid.pinning',
		'isteven-multi-select', 'xeditable','blockUI','daterangepicker','ui.bootstrap.carousel',
		'isteven-multi-select','ui.select'])
	.config(['$routeProvider', 'growlProvider', 'blockUIConfig', function($routeProvider, growlProvider, blockUIConfig) {
		growlProvider.globalTimeToLive(3000);
		growlProvider.globalEnableHtml(true);  
		blockUIConfig.autoBlock = false;
		$routeProvider
			/** attribute section routes*/

			.when('/',
				{templateUrl: 'app/ProductSearchList/ProductSearchList.html'}
				)

			.when('/edit-product/:id',
				{templateUrl:'app/EditProduct/editproduct.html'}
				)

			// .when('/product-variant',
			// 	{templateUrl:'app/productVariant/product-variant.html'}
			// 	)
			.when('/channel',
				{templateUrl:'app/channel/channel.html'}
				)


			// .when('/',
			// 	{templateUrl: 'app/attributeSection/attributeSectionSearch.html'},
			// 	{controller: 'attributeSection/attributeSectionSearchCtrl.js'}
			// 	)
			// .when('/attributeSections',
			// 	{templateUrl: 'app/attributeSection/attributeSectionSearch.html'}, 
			// 	{controller: 'attributeSection/attributeSectionSearchCtrl.js'})
			// .when('/new_attributeSection',
			// 	{templateUrl: 'app/attributeSection/attributeSection.html'}, 
			// 	{controller: 'attributeSection/attributeSectionCtrl.js'})
			// .when('/attributeSection/:id',
			// 	{templateUrl: 'app/attributeSection/attributeSection.html'}, 
			// 	{controller: 'attributeSection/attributeSectionCtrl.js'})
			// .when('/attributeSection/edit/:id',
			// 	{templateUrl: 'app/attributeSection/attributeSection.html'}, 
			// 	{controller: 'attributeSection/attributeSectionCtrl.js'})

			// /** attribute routes*/
			// .when('/attributes',
			// 	{templateUrl: 'app/attribute/attributeSearch.html'})
			// .when('/new_attribute',
			// 	{templateUrl: 'app/attribute/attribute.html'}, 
			// 	{controller: 'attribute/attributeCtrl.js'})
			// .when('/attribute/:id',
			// 	{templateUrl: 'app/attribute/attribute.html'}, 
			// 	{controller: 'attribute/attributeCtrl.js'})
			// .when('/attribute/edit/:id',
			// 	{templateUrl: 'app/attribute/attribute.html'}, 
			// 	{controller: 'attribute/attributeCtrl.js'})

			// /** classification routes*/
			// .when('/classifications',
			// 	{templateUrl: 'app/classification/classificationSearch.html'}, 
			// 	{controller: 'classification/classificationSearchCtrl.js'})
			// .when('/new_classification',
			// 	{templateUrl: 'app/classification/classification.html'}, 
			// 	{controller: 'classification/classificationCtrl.js'})
			// .when('/classification/:id',
			// 	{templateUrl: 'app/classification/classification.html'}, 
			// 	{controller: 'classification/classificationCtrl.js'})
			// .when('/classification/edit/:id',
			// 	{templateUrl: 'app/classification/classification.html'}, 
			// 	{controller: 'classification/classificationCtrl.js'})

			// /** classificationGroup routes*/
			// .when('/classificationGroups',
			// 	{templateUrl: 'app/classificationGroup/classificationGroup.html'}, 
			// 	{controller: 'classificationGroup/classificationGroupCtrl.js'})
			// .when('/classificationGroup/:id',
			// 	{templateUrl: 'app/classificationGroup/classificationGroup.html'}, 
			// 	{controller: 'classificationGroup/classificationGroupCtrl.js'})
			// .when('/classificationGroup/edit/:id',
			// 	{templateUrl: 'app/classificationGroup/classificationGroup.html'}, 
			// 	{controller: 'classificationGroup/classificationGroupCtrl.js'})
			.otherwise({redirectTo: '/'});
		}]);
