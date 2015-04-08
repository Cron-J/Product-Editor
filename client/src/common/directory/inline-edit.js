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
        
            link: function(scope, elm, attrs, ctrl) {
             
             template = '<input class="ui-input-text"  ng-model="' + attrs.model + '">';
            var inp=angular.element($compile(template)(scope));
            inp.css('display','none');
            elm.append(inp);
            var txt=angular.element(elm.children()[0]);
            
             elm.bind('dblclick',function(event){
               event.preventDefault();
               inp.css('display','inline');
               txt.css('display','none');
               inp[0].focus()
             })
             inp.bind('blur',function(){
                inp.css('display','none'); 
                txt.css('display','inline');
                
             })
             inp.bind('keydown keypress',function(event){
               if(event.which===13){
                inp.css('display','none'); 
                txt.css('display','inline');
               }
               if(event.which===27){
                  inp.css('display','none'); 
                  txt.css('display','inline');
               }
               
             })
            }
    };
});