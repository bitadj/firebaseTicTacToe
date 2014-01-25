var ticTacRef;
var IDs;

angular.module("TicTac", ["firebase"])
	.controller("ticTacCtrl", function($scope, $firebase){

	ticTacRef = new Firebase("https://bitadjtictactoe.firebaseio.com/");
 	$scope.fbRoot = $firebase(ticTacRef);

 	// Wait until everything really is loaded
 	$scope.fbRoot.$on("loaded", function() {
		IDs = $scope.fbRoot.$getIndex();
		if(IDs.length == 0)
		{

			$scope.fbRoot.$add( { cells:[['','',''],['','',''],['','','']],
				xTurn:false} );
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





	$scope.takeTurn = function(i, j) {
		$scope.obj.cells[i][j] = ($scope.obj.cells[i][j]=='' ? (($scope.obj.xTurn = !$scope.obj.xTurn) ? 'x' : 'o'): $scope.obj.cells[i][j]);
			$scope.obj.$save();
		

		for (var x = 0; x < $scope.obj.cells.length; x++) {
			console.log($scope.obj.cells[x]);
			if ( checkWin(row(x)) || checkWin(col(x)) || checkWin(diagOne()) || checkWin(diagTwo()) ) {
				console.log($scope.obj.cells[i][j] + " wins!");
				break;
			};
		}; //close for loop

		 
	}; //close takeTurn function


	function checkWin(triplet) {
		return (triplet[0] == triplet[1] && triplet[0] == triplet[2] && triplet[0] != "");
	};
	function row(r) {
		return( $scope.obj.cells[r] );
	};
	function col(c) {
		return ([$scope.obj.cells[0][c], $scope.obj.cells[1][c], $scope.obj.cells[2][c]]);
	};
	function diagOne() {
		return ([$scope.obj.cells[0][0], $scope.obj.cells[1][1], $scope.obj.cells[2][2]]);
	};
	function diagTwo() {
		return ([$scope.obj.cells[0][2], $scope.obj.cells[1][1], $scope.obj.cells[2][0]]);
	};



	$scope.rightBorder = function(i,j) {
		if ((i==0 && j==0) || (i==0 && j==1) || (i==1 && j==0) || (i==1 && j==1) || (i==2 && j==0) || (i==2 && j==1)){
			return true; //assign rightBorder class
		}; 
	}; //close rightBorder

	$scope.bottomBorder = function(i,j) {
		if ((i==0 && j==0) || (i==0 && j==1) || (i==0 && j==2) || (i==1 && j==0) || (i==1 && j==1) || (i==1 && j==2)) {
			return true; //assign bottomBorder class
		};	
	}; // close bottomBorder function


}); //close controller