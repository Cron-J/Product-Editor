// myApp.directive('ngBlur', function() {
//   return function( scope, elem, attrs ) {
//     elem.bind('blur', function() {
//       scope.$apply(attrs.ngBlur);
//     });
//   };
// });

// myApp.directive('ngFocus', function( $timeout ) {
//   return function( scope, elem, attrs ) {
//     scope.$watch(attrs.ngFocus, function( newval ) {
//       if ( newval ) {
//         $timeout(function() {
//           elem[0].focus();
//         }, 0, false);
//       }
//     });
//   };
// });

myApp.directive('editable', function($compile,$parse) {
    return {
        require: 'ngModel',
        
          
          
            link: function(scope, elm, attrs, ctrl) {
              console.log(ctrl.$modelValue);
             template = '<input style="width:100%;height:100%;" ng-model="' + attrs.ngModel + '">';

            var inp=angular.element($compile(template)(scope));
            
             elm.bind('dblclick',function(event){
               event.preventDefault();
               inp.css('display','inline');
              // inp.focus();
                elm.css('display','none'); 
                elm.after(inp);
              
                
             })
             inp.bind('blur',function(){
            
                inp.css('display','none'); 
                elm.css('display','inline');
            
                
             })
            }
        
      
        
        
       
    };
});