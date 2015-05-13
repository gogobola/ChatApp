var application = angular.module('application',['ngRoute', 'ngAnimate', "firebase"]);

application.config(function($routeProvider, $locationProvider, $compileProvider){
  $routeProvider
  .when("/main", {
  	controller: "testController",
    templateUrl: 'templates/main.html'
  }).otherwise({
      redirectTo : "/main"
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

application.factory('chatFactory', ["$firebaseArray","$firebaseObject", function($firebaseArray,$firebaseObject) {
var factory = {};


factory.addNewroom = function(value) {
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/rooms");
	ref.push(value);
}

factory.getRooms = function () {
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/rooms");
	ref.push();
	return $firebaseObject(ref);
}

factory.getRoomMessages = function(value) {
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/"+value);
	ref.push();
	return $firebaseObject(ref);
}

factory.addMessages = function(room,message) {
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/"+room);
	ref.push(message);
	return $firebaseObject(ref);
}

factory.registerAccount = function(user, password){
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/");
	console.log(password);
	ref.createUser({
	  "email": user+"@firebase.com",
	  "password": password
	}, function(error, userData) {
	  if (error) {
	    switch (error.code) {
	      case "EMAIL_TAKEN":
	        $("#creationFailed").html("The new user account cannot be created because the username is already in use.");
	    	$("#creationFailed").slideDown(900).delay(2500).slideUp(900);
	        break;
	      case "INVALID_EMAIL":
	        $("#creationFailed").html("The specified email is not a valid email.");
	    	$("#creationFailed").slideDown(900).delay(2500).slideUp(900);
	        break;
	      default:
	        $("#createFailed").html("Error creating user: " + error);
	        $("#creationFailed").slideDown(900).delay(2500).slideUp(900);
	    }
	  } else {
	    console.log("Successfully created user account with uid:", userData.uid);
	    $("#creationSuccess").slideDown(900).delay(2500).slideUp(900);
	  }
	});
}

factory.login = function(user, password){
	var success = false;
	var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/");
	ref.authWithPassword({
	  "email": user+"@firebase.com",
	  "password": password
	}, function(error, authData) {
	  if (error) {
	    console.log("Login Failed!", error);
	    $("#loginFailed").html("Login " + error);
	    $("#loginFailed").slideDown(900).delay(2500).slideUp(900);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	     $("#loginSuccess").slideDown(900).delay(1000).slideUp(900);
	  }
	});
}

return factory;


}
]);

application.controller("testController",["$scope", "chatFactory", function($scope, chatFactory){
  $scope.messages = [];
  $scope.rooms = [];
  $scope.roomTemplate = "";
  $scope.showNewRoomButton = true;
  $scope.roomMessgs = [];
  $scope.currentRoom = "";
  $scope.showCreateAccount = "";
  $scope.showLoginPage = "";
  $scope.modalTitle = "";
  $scope.currentUser= "";
  $scope.Loggedin = "";
  $scope.showAlert= false;

  var ref = new Firebase("https://glaring-inferno-7726.firebaseio.com/");

  // window.setTimeout(function() {
	 //  $("#alert1").fadeTo(500, 0).slideUp(500, function(){
	 //      $(this).remove();
	 //  });
  // }, 5000);


  init();
  console.log($scope.rooms);
  ref.onAuth(authDataCallback);

  function authDataCallback () {
	var authData = ref.getAuth();
	if (authData) {
	  $scope.currentUser = authData.password.email.replace(/@.*/, '');
	  $scope.Loggedin = true;
	} else {
	  $scope.currentUser= "";
	  $scope.Loggedin = false;
	  console.log("User is logged out");
	}
  }


  function init() {
  	var roomsObject = chatFactory.getRooms();
 	roomsObject.$bindTo($scope, "rooms");
 	
  
  }
  $scope.selectRoom = function (room) {
  	$scope.currentRoom = room;
  	$scope.messages = chatFactory.getRoomMessages(room);
  }


  $scope.loadAcctCreate = function() {
  	$scope.modalTitle = "Create Account";
  	$scope.showCreateAccount = true;
    $scope.showLoginPage = false;
  }

  $scope.createAccount = function(){
  	if (($scope.newUser.password) && ($scope.newUser.confirmPass) && ($scope.newUser.userName)) {
  		if ($scope.newUser.password != $scope.newUser.confirmPass) {
  			$("#passwordWarning").slideDown(900).delay(1000).slideUp(900);
  		}
	  	else {
		  	chatFactory.registerAccount($scope.newUser.userName,$scope.newUser.password);
		  	$scope.newUser.userName = "";
		  	$scope.newUser.password = "";
	  	}

  	}
  	else {
  		$("#passwordWarning").slideDown(900).delay(1000).slideUp(900);
  	}
  	
  }

  $scope.loadLoginPage = function() {
  	  $scope.modalTitle = "Login";
	  $scope.showCreateAccount = false;
	  $scope.showLoginPage = true;
  }

  $scope.login = function() {
	  if (($scope.user.user) && ($scope.user.password)) {
	  	 chatFactory.login($scope.user.user,$scope.user.password);
	  	 $scope.user.user = "";
	  	 $scope.user.password = "";
	  }
	  else {
	  	 $("#loginFailed").html("Please ensure no input fields are empty");
	  	 $("#loginFailed").slideDown(900).delay(2500).slideUp(900);
	  }
  }
  $scope.logout = function() {
  	ref.unauth();
    $("#logoutSuccess").slideDown(900).delay(1000).slideUp(900);
  }

  $scope.addMessage = function () {
  	console.log("I am here");
  	console.log($scope.roomMessgs);
  	var message = {};
  	if($scope.currentUser) {
  	 	message = {
	  			user: $scope.currentUser,
	  			message: $scope.newMessage.message,
	  			date:  moment().format('MMMM Do YYYY, h:mm:ss a')

	  	}
	 }
  	else {
  		message = {
	  			user: "Anonymous",
	  			message: $scope.newMessage.message,
	  			date:  moment().format('MMMM Do YYYY, h:mm:ss a')

	  	};
  	}
  	chatFactory.addMessages($scope.currentRoom,message);
  	$scope.newMessage.message = "";
  	if($scope.showAlert == false && (!($scope.currentUser))){
  		$("#loginMessage").slideDown(900).delay(2500).slideUp(900);
  	}
  	$scope.showAlert = true;
  }


  $scope.newRoom = function(){
  	$scope.roomTemplate = "templates/newForm.html";
  	$scope.showNewRoomButton = false;

  }


  $scope.saveRoom = function() {
  	 chatFactory.addNewroom($scope.newRoom.NewName);
  	 $scope.roomTemplate = "";
  	 $scope.showNewRoomButton = true;

  }

  $scope.closeRoom = function() {
  	 $scope.roomTemplate = "";
  	 $scope.showNewRoomButton = true;
  }

  $scope.$watch('messages', function(newVal, oldVal) {
  	console.log("this happened");

});
 

}
]);