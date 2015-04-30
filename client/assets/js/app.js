var application = angular.module('application', ['ngRoute', 'firebase']);

application.config(function ($routeProvider, $locationProvider, $compileProvider) {
	$routeProvider
		.when("/test2", {
		controller: "testController",
		templateUrl: 'templates/test2.html'
	}).otherwise({
		redirectTo: "/test2"
    });
	$locationProvider.html5Mode(true);
});

application.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

application.factory('chatFactory', ['$firebaseObject', function ($firebaseObject) {
	var messages = [

		{
			user: "Billy",
			message: "Message1bjbhbjhbjhbjhbjhbjhbjhbjhbjhbj",
			date: "January"
		},
		{
			user: "Rico",
			message: "Message2",
			date: "Feburary"
		},
		{
			user: "Suave",
			message: "Message3",
			date: "March"
		},

		{
			user: "jumanji",
			message: "MessageA",
			date: "January"
		},
		{
			user: "lipo",
			message: "MessageB",
			date: "Feburary"
		},
		{
			user: "yuyu",
			message: "MessageC",
			date: "March"
		}
	];
	var rooms = {
		"room1":
		[
			{
				user: "Billy",
				message: "Message1bjbhbjhbjhbjhbjhbjhbjhbjhbjhbj",
				date: "January"
			},
			{
				user: "Rico",
				message: "Message2",
				date: "Feburary"
			},
			{
				user: "Suave",
				message: "Message3",
				date: "March"
			},

			{
				user: "jumanji",
				message: "MessageA",
				date: "January"
			},
			{
				user: "lipo",
				message: "MessageB",
				date: "Feburary"
			},
			{
				user: "yuyu",
				message: "MessageC",
				date: "March"
			}
		]
		,
		"room2":
		[
			{
				user: "BOO",
				message: "Message1bjbhbjhbjhbjhbjhbjhbjhbjhbjhbj",
				date: "January"
			},
			{
				user: "SOO",
				message: "Message2",
				date: "Feburary"
			},
			{
				user: "LUUU",
				message: "Message3",
				date: "March"
			},

			{
				user: "NNNN",
				message: "MessageA",
				date: "January"
			},
			{
				user: "AAA",
				message: "MessageB",
				date: "Feburary"
			},
			{
				user: "ZZZ",
				message: "MessageC",
				date: "March"
			}
		]

	};

	//var roomsref = new Firebase("https://glaring-inferno-7726.firebaseio.com/");


	var factory = {};

	factory.getMessages = function () {
		return rooms
	}
	factory.getRooms = function () {
		return Object.keys(rooms);
	}

	factory.getrefMessages = function () {
		var roomsref = new Firebase("https://glaring-inferno-7726.firebaseio.com/");
		var syncObject = $firebaseObject(roomsref);
		syncObject.$loaded().then(function () {
			return syncObject;
		});

	}

	return factory;
}
]);

application.controller("testController", function ($scope, $firebaseObject, $firebaseArray, chatFactory) {
	$scope.messages = [];
	$scope.rooms = [];
	$scope.roomTemp = "";
	$scope.showNewRoomButton = true;
	$scope.roomMessgs = [];
	//$scope.data2; 
	chatFactory.getrefMessages().$bindto($scope, data2);
	// var roomsref = new Firebase("https://glaring-inferno-7726.firebaseio.com/");
	// var syncObject = $firebaseObject(roomsref);

	var room1 = "room1";
	console.log(syncObject.room1);

	//	syncObject.$loaded().then(function () {
	//		console.log("I am here");
	//		//$scope.roomMessgs = syncObject;
	//		angular.forEach(syncObject, function (value, key) {
	//			console.log(key, value);
	//		});
	//	});
	init();
	console.log($scope.data2);

	function init() {
		$scope.rooms = Object.keys(syncObject);
	}
	$scope.selectRoom = function (room) {
		$scope.currentRoom = room;
		console.log($scope.roomMessgs);
		$scope.messages = $scope.roomMessgs[room];


	}

	$scope.addMessage = function () {
		console.log("I am here");
		console.log($scope.roomMessgs);
		if ($scope.newMessage.user) {
			$scope.messages.push({
				user: $scope.newMessage.user,
				message: $scope.newMessage.message,
				date: moment().format('MMMM Do YYYY, h:mm:ss a')

			});
		}
		else {
			$scope.messages.push({
				user: "Anonymous",
				message: $scope.newMessage.message,
				date: moment().format('MMMM Do YYYY, h:mm:ss a')

			});
		}
		console.log($scope.roomMessgs);
	}

	$scope.show = function (messg) {
		console.log(messg + " show");
	}

	$scope.newRoom = function () {
		$scope.roomTemp = "templates/newForm.html";
		$scope.showNewRoomButton = false;

	}


	$scope.saveRoom = function () {
		$scope.rooms.push($scope.newRoom.NewName);
		$scope.roomMessgs[$scope.newRoom.NewName] = [];
		$scope.roomTemp = "";
		$scope.showNewRoomButton = true;
		console.log($scope.rooms);


	}


});