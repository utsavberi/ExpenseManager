var months = ['jan', 'feb', 'mar','apr','may','jun']

var groups={
	'allston convenience store':['allston','LEE\'S 2'],
	'amazon':['amazon'],
	'bsc':['bsc'],
	'restaurants':['Bernies','cask','charlies','eats','aubonpain','airport'],
	'uber':['uber'],
	'comcast':['comcast'],
	'cvs':['cvs'],
	'eversource':['eversource'],
	'rent':['Field Corp'],
	'greyhound':['greyhound'],
	'irs':['irs'],
	'liquor':['liquor'],
	'mbta':['mbta']


};

function createDashboard(obs){
	this.obs = obs;

	function parseMonthlyData(obs){
		var monthlyData = [];
		for(var i = 0; i<obs.length; i++){
			if(!!!monthlyData[obs[i].date.getMonth()]){
				monthlyData[obs[i].date.getMonth()] = [];
			}
			monthlyData[obs[i].date.getMonth()].push(obs[i]);
		}	
		return monthlyData;
	}

	function getMonthlySavingsData(monthlyData){
		var savings = [];
		for(var i = 0; i<monthlyData.length; i++){
			var first = monthlyData[i][0];
			var last = monthlyData[i][monthlyData[i].length - 1];

			savings.push( last.balance - first.balance);
		}
		return savings;
	}

	function getExpenseData(monthlyData){
		var expenses = [];
		for(var i = 0; i<monthlyData.length; i++){
			var sum = 0;
			for(var j = 0; j<monthlyData[i].length; j++){
				if(monthlyData[i][j].amount<0){
					sum+=monthlyData[i][j].amount;
				}
			}
			expenses.push( sum*-1);
		}
		return expenses;
	}

	function getSortedData(monthlyData){
		var result = [];
		for(var i = 0; i<monthlyData.length; i++){
			result.push(monthlyData[i].sort(function(a,b){return a.amount - b.amount}))
		}
		return result;
	}

	function getGroupName(fullName){
		return fullName;//fullName.replace(/[\d+#]/g,'').substr(0,7);
	}
	function getGroupedMonthlyData(monthlyData){
		groupedMonthlyData = [];
		for (var i = 0; i<monthlyData.length; i++){
			for(var j= 0; j<monthlyData[i].length; j++){
				if(monthlyData[i][j].amount<0)
				{
					if(!!!groupedMonthlyData[i]){
						groupedMonthlyData[i] = [];
					}
					groupName = getGroupName(monthlyData[i][j].name);
					if(!!!groupedMonthlyData[i][groupName]){
						groupedMonthlyData[i][groupName] = 0;

						groupedMonthlyData[i][groupName] = 0;
					}
					groupedMonthlyData[i][groupName] +=monthlyData[i][j].amount;
				}
			}
		}
		var groupedMonthlyDataOb = [];
		for(var i = 0; i<groupedMonthlyData.length; i++){
			var ob = {data:{}, month:i, monthName:months[i]};
			for(key in groupedMonthlyData[i]){
				ob['data'][key] = groupedMonthlyData[i][key];
			}
			groupedMonthlyDataOb.push(ob);
		}
		return groupedMonthlyDataOb;
	}

	this.monthlyData = parseMonthlyData(this.obs);
	this.savings = getMonthlySavingsData(this.monthlyData);
	this.expenses = getExpenseData(this.monthlyData);
this.sortedMonthlyData = getSortedData(this.monthlyData);
	// console.log(getSortedData(monthlyData));
	// var sorted = getSortedData(monthlyData);
	// for (var i = 0; i<sorted.length; i++){
	// 	console.log(months[i]);
	// 	for(var j = 0; j<sorted[i].length; j++){
	// 		if(sorted[i][j].amount<0){
	// 			console.log(JSON.stringify(sorted[i][j]));
	// 		}
	// 	}
	// }

	this.groupedMonthlyData = getGroupedMonthlyData(this.monthlyData);
	console.log(this.groupedMonthlyData);

	this.drawCharts = function(){

		createBalanceChart(this.obs);
		createSavingsChart(this.savings);
		createExpenseChart(this.expenses);

	}



		// var data = [{
		//   values: [19, 26, 55],
		//   labels: ['Residential', 'Non-Residential', 'Utility'],
		//   type: 'pie'
		// }];

		// var layout = {
		//   height: 400,
		//   width: 500
		// };

		// Plotly.newPlot('jan_pc', data, layout);
}

obs = convertAccountDataToOb(data, parsers);
var dashboard = new createDashboard(obs, true);
dashboard.drawCharts();
// createDashboard(data, [bofaDebitParser, bofaCreditParser], true);
// createDashboard(abhaKutiya, bofaDebitParser, true);
// createDashboard(data, bofaCreditParser, false);
// credit card data

// obs = convertAccountDataToOb(creditCardData, bofaCreditParser);
//1600 + 85 + 55 + 60 + 150 + 20 + 500 + 260 + 500 + 150 = 3380  + 500 enjoy = 3880 - 6916 ~ 3000 savings every month