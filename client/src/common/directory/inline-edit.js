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

myApp.directive('editable', function() {
    return {
       
        link: function(scope, elm, attrs) {
            // view -> model
            elm.bind('blur', function() {
                 elm.removeAttr('contentEditable');
            });

            // model -> view
            // ctrl.render = function(value) {
            //     elm.html(value);
            // };

            // load init value from DOM
            // ctrl.$setViewValue(elm.html());

            elm.bind('dblclick', function(event) {
              event.preventDefault();
                console.log("keydown " + event.which);
                elm.attr('contentEditable', true);
                elm[0].blur();
                elm[0].focus();
                // var esc = event.which == 27,
                //     el = event.target;

                // if (esc) {
                //         console.log("esc ");
                //         ctrl.$setViewValue(elm.html());
                //         el.blur();
                //         event.preventDefault();                        
                //     }
                    
            });
            
        }
    };
});