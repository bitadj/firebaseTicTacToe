var ticTacRef;
var IDs;
angular.module("TicTac", ["firebase"])
 .controller("TicTacCtrl", function($scope, $firebase){
 	
 	ticTacRef = new Firebase("https://issuesbitadj.firebaseio.com/");
 	$scope.fbRoot = $firebase(ticTacRef);

 	// Wait until everything really is loaded
 	$scope.fbRoot.$on("loaded", function() {
		IDs = $scope.fbRoot.$getIndex();
		if(IDs.length == 0)
		{
			// What???  No Board????  Let's build one.
	 		$scope.fbRoot.$add( { board:['','','','','','','','',''],
 	 			xTurn:true} );
			$scope.fbRoot.$on("change", function() {
				IDs = $scope.fbRoot.$getIndex();
				$scope.obj = $scope.fbRoot.$child(IDs[0]);
			});
		}
		else
		{
			$scope.obj = $scope.fbRoot.$child(IDs[0]);
		}

	});

 	$scope.makeMove = function(idx){
 		if($scope.obj.board[idx]=="")
 		{
			$scope.obj.board[idx] = $scope.obj.xTurn ?'X':'O';
			$scope.obj.xTurn = !$scope.obj.xTurn;
			$scope.obj.$save();
 		}
 	};
 
 });