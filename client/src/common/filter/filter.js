myApp.filter('formatStatus',function(){
	var status={
        '080':'080 error',                 
        '090':'090 warning',                
        '100':'100 new',
        '105':'105 changed',                
        '200':'200 checked',                
        '225':'225 translate',              
        '250':'250 Translation needed',     
        '275':'275 Translation in progress',
        '300':'300 waiting',                
        '350':'350 translate ',             
        '400':'400 confirmed',              
        '420':'420 Immediate',              
        '700':'700 temporary',              
        '800':'800 deleted'                
    };

    return function(input){
    		if(!input)
    			return '';
    		else{
    			return status[input];
    		}
    	};
     
});


myApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});


myApp.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});