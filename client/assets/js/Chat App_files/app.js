var application = angular.module('application',['ngRoute',"firebase"]);

application.config(function($routeProvider, $locationProvider, $compileProvider){
  $routeProvider
  .when("/test2", {
  	controller: "testController",
    templateUrl: 'templates/test2.html'
  }).otherwise({
      redirectTo : "/test2"
    });
  $locationProvider.html5Mode(true);
});

application.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

application.factory('chatFactory', ["$firebaseArray","$firebaseObject" function($firebaseArray,$firebaseObject) {


return function (room) {
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/"+room);
	ref.push("room1");
	return $firebaseObject(ref);
}



}
]);

application.controller("testController",["$scope", "chatFactory", function($scope, chatFactory){
  $scope.messages = [];
  $scope.rooms = [];
  $scope.roomTemp = "";
  $scope.showNewRoomButton = true;
  $scope.roomMessgs = [];
  init();
  console.log($scope.rooms);
  // $scope.rooms.$add({"room1" : 
		// 				[		
		// 					{
		// 						user : "Billy",
		// 						message : "Message1bjbhbjhbjhbjhbjhbjhbjhbjhbjhbj",
		// 						date : "January"
		// 					},
		// 					{
		// 						user : "Rico",
		// 						message : "Message2",
		// 						date : "Feburary"
		// 					},
		// 					{
		// 						user: "Suave",
		// 						message : "Message3",
		// 						date : "March"
		// 					},
					
		// 					{
		// 						user : "jumanji",
		// 						message : "MessageA",
		// 						date : "January"
		// 					},
		// 					{
		// 						user: "lipo",
		// 						message : "MessageB",
		// 						date : "Feburary"
		// 					},
		// 					{
		// 						user : "yuyu",
		// 						message : "MessageC",
		// 						date : "March"
		// 					}
		// 				]}).then(function (ref) {
  //   console.log($scope.rooms);
  // });

  function init() {
  	$scope.rooms = chatFactory("rooms");
  	console.log($scope.rooms);
  //	$scope.roomMessgs = chatFactory.getMessages();
 	//$scope.roomMessgs = chatFactory();

  }
  $scope.selectRoom = function (room) {
  	$scope.currentRoom = room;
  	console.log($scope.roomMessgs);
  	$scope.messages = $scope.roomMessgs[room];

  }

  $scope.addMessage = function () {
  	console.log("I am here");
  	console.log($scope.roomMessgs);
  	if($scope.newMessage.user){
	  	$scope.messages.push({
	  			user: $scope.newMessage.user,
	  			message: $scope.newMessage.message,
	  			date:  moment().format('MMMM Do YYYY, h:mm:ss a')

	  	});
  	}
  	else{
  		$scope.messages.push({
	  			user: "Anonymous",
	  			message: $scope.newMessage.message,
	  			date:  moment().format('MMMM Do YYYY, h:mm:ss a')

	  	});
  	}
  	console.log($scope.roomMessgs);
  }

  $scope.show = function(messg) {
  		console.log(messg + " show");
  }

  $scope.newRoom = function(){
  	$scope.roomTemp = "templates/newForm.html";
  	$scope.showNewRoomButton = false;

  }


  $scope.saveRoom = function() {
  	 $scope.rooms.push($scope.newRoom.NewName);
	 $scope.roomMessgs[$scope.newRoom.NewName] = [];
  	 $scope.roomTemp = "";
  	 $scope.showNewRoomButton = true;
  	 console.log($scope.rooms);

 
  }
 

}
]);