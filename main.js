var ticTacRef;
var IDs;
var mySymbol;

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

 	$scope.takeTurn = function(i, j) {
 		if(canMove(i, j)) {   
			mySymbol = $scope.obj.cells[i][j] = currentSymbol();
			console.log("mySymbol: " + mySymbol);
			$scope.obj.xTurn = !$scope.obj.xTurn;
			checkWin(i, j);
			$scope.obj.$save();
 		}
 	};

 	canMove = function(i, j) {
 		return cellEmpty(i, j) && symbolPlayable();
 	};

 	cellEmpty = function(i, j) {
		return $scope.obj.cells[i][j] == '';
 	};

 	symbolPlayable = function() {
 		return myTurn() || (currentSymbolUnused() && haveSymbol());
 	};

 	myTurn = function() {
 		return currentSymbol() == mySymbol;
 	};

 	currentSymbolUnused = function() {
 		return !$scope.obj.cells.join().match(currentSymbol());
 	};

 	haveSymbol = function() {
 		return !mySymbol;
 	};

 	currentSymbol = function() {
 	  return $scope.obj.xTurn ? 'x' : 'o';
 	} 	

	function checkWin(i, j) {
		for (var x = 0; x < $scope.obj.cells.length; x++) {
			if (checkCombos(x)){
				console.log($scope.obj.cells[i][j] + " wins!");
					break;
			};
		}; //close for loop
	}; //close checkWin function

	function checkCombos(idx) {
		return checkThreeCells(row(idx)) || checkThreeCells(col(idx)) || checkThreeCells(diagOne()) || checkThreeCells(diagTwo())
	};

	function checkThreeCells(triplet) {
		return triplet[0] == triplet[1] && triplet[0] == triplet[2] && triplet[0] != '';
	};

	function row(r) {
		return $scope.obj.cells[r];
	};

	function col(c) {
		return [$scope.obj.cells[0][c], $scope.obj.cells[1][c], $scope.obj.cells[2][c]];
	};

	function diagOne() {
		return [$scope.obj.cells[0][0], $scope.obj.cells[1][1], $scope.obj.cells[2][2]];
	};

	function diagTwo() {
		return [$scope.obj.cells[0][2], $scope.obj.cells[1][1], $scope.obj.cells[2][0]];
	};

	$scope.rightBorder = function(i,j) {
		return twoBorders(i, j) || (i==2 && j==0) || (i==2 && j==1);
	}; //close rightBorder

	$scope.bottomBorder = function(i,j) {
		return twoBorders(i, j) || (i==0 && j==2) || (i==1 && j==2);
	}; // close bottomBorder function

	function twoBorders(i, j) {
		return (i==0 && j==0) || (i==0 && j==1) || (i==1 && j==0) || (i==1 && j==1);
	};

}); //close controller