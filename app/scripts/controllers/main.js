'use strict';

/**
 * @ngdoc function
 * @name driveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveApp
 */
angular.module('driveApp').controller('MainCtrl', function ($scope) {
	  $scope.show = false;
	  $scope.folders=[];
	 // $scope.folders = [];
      // Client ID and API key from the Developer Console
      var CLIENT_ID = '285136715822-sb83esdvdgttgleka2j7b76pnri5j2vh.apps.googleusercontent.com';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';


      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      $scope.handleClientLoad = function () {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES,
          //api_key: 'AIzaSyB3oHGPbgDJtB729TDy8oweDLGQVmqApmk'
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listFiles();
          $scope.show = true;
          /*$.ajax({method:'GET', 
          	url:'https://www.googleapis.com/drive/v3/teamdrives', 
          	success:function(data){
          		console.log(data)
          	}, error: function(data){
          		console.log/
          	}});*/
        } else {
          $scope.show = false;
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        if(pre) { 
        	pre.appendChild(textContent);
        }
      }

      /**
       * Print files.
       */
      function listFiles() {
        gapi.client.drive.files.list({
          'pageSize': 1000,
          'fields': "nextPageToken, files(id, name)",
          'q': "mimeType = 'application/vnd.google-apps.folder'"
        }).then(function(response) {
        	console.log(response)
        	if(response.hasOwnProperty('result')){
        		if(response.result.hasOwnProperty('files')){
        			console.log("heeey")
        			var x = []
        			for(var i = 0; i < response.result.files.length; i++){
        				console.log("Hellos")
        				x.push(response.result.files[i]);
        				console.log(x)
        			}
        			
        			$scope.$apply(function(){
        				$scope.folders = x;	
        			})
        			
        		}	
        	}
          
        });
      }

       $scope.handleClientLoad();
     
  });
