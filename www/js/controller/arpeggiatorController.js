 /**
  * Controler for Arpeggiator
  * @type {Object}
  */
 app.controller('arpeggiatorController', function($rootScope, $state,$scope, $interval, $window) {
     /**
      * Watch device orientation
      * @type {Object}
      */
 document.ontouchmove = function(event) {
     event.preventDefault();
 }
        if(!$rootScope.clientToken && DEBUG == false){
           $state.go('login')
       }
      var half = (360/7)/2;
      $scope.noteOrder = $rootScope.chordOrders[0];
      $scope.oscillatorType = 'sinus';
      $scope.arpeggiatorActivated = false;

     $scope.notes = {
     	'C' : {
     		degree: 360/7*0,
     		name:'C',
     		color:'#916CE9'
     	},
     	'D' : {
     		degree: 360/7*1,
     		name:'D',
     		color:'#F9AA55'
     	},
     	'E' : {
     		degree: 360/7*2,
     		name:'E',
     		color:'#FF6DB0'
     	},
     	'F' : {
     		degree: 360/7*3,
     		name:'F',
     		color:'#6DA9FF'
     	},
     	'G' : {
     		degree: 360/7*4,
     		name:'G',
     		color:'#74D361'
     	},
     	'A' : {
     		degree: 360/7*5,
     		name:'A',
     		color:'#C11212'
     	},
     	'B' : {
     		degree: 360/7*6,
     		name:'B',
     		color:'#3D45BC'
     	},
     }


     $scope.toggleArpeggiator = function(){
     	 socket.emit('changeArpeggiatorPower', {value: !$scope.arpeggiatorActivated , token:$rootScope.clientToken});
     	 $scope.arpeggiatorActivated = !$scope.arpeggiatorActivated;
     }

     $scope.changeNoteOrder = function(i){
     	$scope.noteOrder = $rootScope.chordOrders[i];
     	socket.emit('changeArpeggiatorNoteOrder',{value: i,token:$rootScope.clientToken});
     }

     $scope.changeOscillatorType = function(type){
     		$scope.oscillatorType = type;
     	     socket.emit('changeOscillatorType',{value: type,token:$rootScope.clientToken} );

     }
     $scope.rootNote = $scope.notes.C;
     socket.emit('changeArpeggiatorOrientation', {value: $scope.rootNote,token:$rootScope.clientToken});

     angular.element($window).bind("deviceorientation", function(event) {
         $scope.$apply(function() {
             $scope.currentOrientation = {
                 alpha: event.alpha ,
                 beta: event.beta,
                 gamma: event.gamma,
             };
             angular.forEach($scope.notes, function(value, key) {
			  	if($scope.currentOrientation.alpha >= value.degree - half && $scope.currentOrientation.alpha < value.degree + 360/7 -half){
			  		if(value != $scope.rootNote){
			  				$scope.rootNote = value;
			  			 socket.emit('changeArpeggiatorOrientation', {value: $scope.rootNote,token:$rootScope.clientToken});

			  		}
			  		
			  	}
			 });
         })

     });
     $rootScope.connectDevice("arpeggiator");


 });