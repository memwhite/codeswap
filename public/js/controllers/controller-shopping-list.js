(function () {
    'use strict';

    var app = angular.module('myApp');

	app.controller('ShoppingListController', ['$scope', '$http', '$routeParams', 'API_BASE', '$location', function($scope, $http, $routeParams, API_BASE, $location){


		// GET SPECIFIC LIST
		$scope.list = [];
		var id = $routeParams.id;

		$http({
			method: 'GET',
			url: API_BASE + 'shopping-lists/' + id
		}).then(function successCallback(response) {
			$scope.list = response.data[0];
		}, function errorCallback(response) {
			console.log('it did not work');
			console.log(response.statusText);
		});


		// REMOVE LIST
		$scope.removeList = function(){
			var id = $scope.list.id;
			console.log(id);
			$http.delete(API_BASE + 'shopping-lists/' + id)
				.success(function (data, status, headers, config) {
					console.log('you deleted :' + $scope.list);
	            })
	            .error(function (data, status, header, config) {
	            });
	        $location.path('/home');
		};

		// RANDOM ID
		function makeid()
		{
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i=0; i < 20; i++ ){
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			text += Date.now();

			return text;
		}


		// ADD ITEM
		$scope.addItem = function(){
			var created = new Date();
			var newID = makeid();

			if($scope.list.hasOwnProperty('items') === false){
				$scope.list.items = [];
			}
			$scope.list.items.push({
				name : $scope.newItem.name,
				priority : $scope.newItem.priority,
				note: $scope.newItem.note,
				isChecked: false,
				listId: $scope.list.id,
				created: created,
				id: newID,
				picture:'usr-img/' + newID + '.jpg'
			});
			// console.log($scope.list.items);
			$http.put(API_BASE + 'shopping-lists/', $scope.list)
				.success(function (data, status, headers, config) {
	            })
	            .error(function (data, status, header, config) {
	            });

	        // Reset input fields after submit
	        $scope.newItem = {
	        	name: "",
	        	priority: "",
	        	note: ""
	        };
		};


		// REMOVE ITEM
		$scope.removeItem = function(item){
			var removedItem = $scope.list.items.indexOf(item);
			$scope.list.items.splice(removedItem, 1);

			$http.put(API_BASE + 'shopping-lists', $scope.list)
				.success(function (data, status, headers, config) {
	            })
	            .error(function (data, status, header, config) {
	            });
		};


		// CLEAR ITEMS
		$scope.clearItems = function(){
			$scope.list.items.length = 0;

			$http.put(API_BASE + 'shopping-lists', $scope.list)
				.success(function (data, status, headers, config) {
	            })
	            .error(function (data, status, header, config) {
	            });
		};


		// CLEAR CHECKED ITEMS
		$scope.clearCheckedItems = function(){
			var length = $scope.list.items.length-1;

			for (var i = length; i > -1; i--) {
				if ($scope.list.items[i].isChecked === true) {
						$scope.list.items.splice(i,1);
				}
			}

			$http.put(API_BASE + 'shopping-lists', $scope.list)
				.success(function (data, status, headers, config) {
	            })
	            .error(function (data, status, header, config) {
	            });
		};

		//Edit Items / Checked Items
		$scope.editItem = function(){

			$http.put(API_BASE + 'shopping-lists', $scope.list)
				.success(function (data, status, headers, config) {
	            })
	            .error(function (data, status, header, config) {
	            });
		};

		// SORT ITEMS
		$scope.sortBy = function(propertyName) {
	    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
	    $scope.propertyName = propertyName;
		};

		$scope.uploadImg = function(index){
				var files = $("#upload-picture"+index).get(0).files;

				if (files.length > 0) {
					// create a FormData object which will be sent as the data payload in the
					// AJAX request
					var formData = new FormData();

					formData.append('listId', $("#upload-list-id"+index).val());

					// add the files to formData object for the data payload
					formData.append('upload', files[0], files[0].name);

					// reload the page
					location.reload();

				}

				$.ajax({
				url: '/upload',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data) {
                console.log('upload successful!\n' + data);
				}
				});
			};
				$http.put(API_BASE + 'shopping-lists', $scope.list)
				.success(function (data, status, headers, config) {
	            })
	            .error(function (data, status, header, config) {
	            });

	}]);

}());
