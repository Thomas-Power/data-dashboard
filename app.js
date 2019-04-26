var app1 = angular.module("app1", []);

function make_graph(id_number){
	return "<img class=graph ng-click=editGraph($event) id=".concat(id_number, " src='static/", id_number, ".png'>");
};

var target_id = "";
var cur_ticker = "";

app1.controller("ctrl_home", function($scope){
	$scope.enterApp = function(){
		$("#home_page").hide();
		$("#generate_page").hide();
		$("#display_page").show();
	};
});

app1.controller("ctrl_display", ['$scope', '$compile', function ($scope, $compile){
	$scope.loadData = function(){
		$scope.Request_Status = "gathering data..." 
		cur_ticker = $scope.ticker_name;
		$.ajax({
			type: "GET",
			url: "http://localhost:5000/graph_ids",
			data: {
				"ticker_name":$scope.ticker_name
			}
		}).then( function(result){
			$("#add_new").show()
			$(".graph").remove()
			var id_numbers = result.split(",");
			for (let id_number of id_numbers){
				$("#graphs").prepend($compile(make_graph(id_number))($scope));
			}
			$scope.Request_Status = "" 
			$scope.$apply();
		});
	};
	
	$scope.editGraph = function(event){
		$("#home_page").hide();
		$("#display_page").hide();
		$("#generate_page").show();
		target_id = event.target.id;
	}
	
	$scope.newGraph = function(event){
		$("#home_page").hide();
		$("#display_page").hide();
		$("#generate_page").show();
		target_id = "new";
	}
	
	$scope.$on("refresh_data", function(event){
		console.log("EVENT HIT");
		$scope.loadData();
	});
	
	$scope.highlight = function(){
		$("#add_new").attr("src", "add_new_highlighted.png?_ts=" + new Date().getTime());
		$scope.$apply();
	}
	
	$scope.revertHighlight = function(){
		$("#add_new").attr("src", "add_new.png?_ts=" + new Date().getTime());
		$scope.$apply();
	}
}]);

app1.controller("ctrl_generate", ['$scope', '$compile', function($scope, $compile){
	$scope.goBack = function(){
		$("#home_page").hide();
		$("#generate_page").hide();
		$("#display_page").show();
	};
	
	$.ajax({
		url: "/Action_List",
	}).then( function(result){
			$scope.action_list = result;
			$scope.actions = Object.keys(result);
			$scope.$apply();			
	});
	
	$scope.showOptions = function(){
		$(".option").hide();
		$scope.action_list[$scope.action_select].forEach(action =>{
			action = "#".concat(action, "_option")
			$(action).show();
		});
		$scope.$apply();
	};
	
	$scope.generateData = function(){
		$scope.Request_Status = "gathering data..." 
		$.ajax({
			type: "GET",
			url: "http://localhost:5000/create_graph",
			data: {
				"ticker_name":cur_ticker,
				"action":$scope.action_select,
				"symbol":$scope.symbol,
				"symbol_one":$scope.symbol_one,
				"symbol_two":$scope.symbol_two,
				"start_date":$scope.start_date,
				"end_date":$scope.end_date,
				"bins":$scope.bins,
				"days_scope":$scope.days_scope,
				"linear_regress":$scope.linear_regress,
				"id_number":target_id,
				"short":$scope.shorting,
				"leveredge":$scope.leveredge
			}
		}).then( function(result){
			if(target_id === "new"){
				$("#graphs").prepend($compile(make_graph(result))($scope));
			}
			else{
				$("#" + result).attr("src", "static/" + result + ".png?_ts=" + new Date().getTime());
			}
			$scope.$emit('refresh_data');
			$scope.Request_Status = "" 
			$scope.goBack();
		});
	};
	
	$scope.deleteGraph = function(){
		$.ajax({
			type: "GET",
			url: "http://localhost:5000/delete_graph",
			data: {
				"id_number":target_id
			}
		}).then( function(result){
			$("#" + target_id).remove();
			$scope.$emit('refresh_data');
			$scope.goBack();
		});
	};
}]);


