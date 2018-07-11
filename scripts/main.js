var months = ['jan', 'feb', 'mar','apr','may','jun']


function monthloyDataParser(records){
	this.records = records;
	this.getData = function(){
		var monthlyData = [];
		for(var i = 0; i<records.length; i++){
			if(!!!monthlyData[records[i].date.getMonth()]){
				monthlyData[records[i].date.getMonth()] = [];
			}
			monthlyData[records[i].date.getMonth()].push(records[i]);
		}	
		return monthlyData;
	}
}

function Dashboard(monthlyData){

	function getMonthlySavingsData(monthlyData){
		var savings = [];
		for(var i = 0; i<monthlyData.length; i++){
			var first = null;
			var last = null;
			for(var j = 0; j<monthlyData[i].length; j++){
				if(first === null && monthlyData[i][j].balance){
					first = monthlyData[i][j];
				}
				if(monthlyData[i][j] && monthlyData[i][j].balance){
					last = monthlyData[i][j];
				}
			}
			savings.push( last.balance - first.balance);
		}
		return savings;
	}

	function getMonthlyExpenseData(monthlyData){
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

	function getMonthlySortedData(monthlyData){
		var copy = [...monthlyData];
		var result = [];
		for(var i = 0; i<copy.length; i++){
			result.push(copy[i].sort(function(a,b){return a.amount - b.amount}))
		}
		return result;
	}

function getRandomColor(){
			return "hsl(" + 360 * Math.random() + ',' +
                 (25 + 70 * Math.random()) + '%,' + 
                 (85 + 10 * Math.random()) + '%)';
		}
var groups={
			'allston convenience store':['ALLSTON CONVENIENCE STOR','LEE\'S 2', '7-eleven','RICHDALE'],
			
			'shopping':['ELEMENTS BROOKLINE','MICHAEL KORS','CIRCLE K 07076 WEST FALMOUTHME','PRIMARK','amazon','TJMAXX','gap','target','BATH AND BODY WORKS','LUSH',
			'LOCCITANE','BATH AND BODY WORKS','MAC','BARNES & NOBLE','VICTORIA','WAYFAIR','GROUPON','PRIME VIDEO'],
			
			'health':['bsc','cvs'],
			'bills':['comcast','sprint','NATIONAL GRID','eversource','Field Corp','ROKU','SUPERCUTS','THREADING'],

			'vacation':['BKOFAMERICA ATM 05/26 #000007497 WITHDRWL ALLSTON ALLSTON MA','SPIRIT','NEW ORLEANS','INDIA HOUSE','SUGARLOAF','CAJUN ENCOUNTERS','BKOFAMERICA ATM 02/25 #000007062 WITHDRWL ALLSTON ALLSTON MA','SANTANDER 02/16 #000481589 WITHDRWL 100 Huntington Av Boston MA'],

			'groccery':['STAR','TRADER JOE\'S','ALLSTON MARKET'],
			
			'restaurants and party':['EAT24','D ELLIES CARABASET','VENMO','Bernies','cask','charlies','eats','aubonpain','airport',
			'THE CHICKEN','TEMAZCAL','OAK BLUFFS','BCG/CENTERPLATE','MANO SALWA KABAB',
			'MAX BRENNER','WHISKEY','DOMINO', 'CUCHI CUCHI','FOODA','CHATIME','WAGAMAMA','MCDONALD','YARD HOUSE',
			'BAGUETTE','CHIPOTLE','BARCELONA','PANDA','EB HIDEOUT COMEDY','DUNKIN','MART','liquor','movie','REGAL','HOPEWELL','DURGIN PARK'],

			'uber_lyft':['uber','LYFT'],
			'public transportation':['LOGAN','mbta'],
			'irs':['irs'],

			'TransferWise':['TransferWise'],
			'molly fee':['law','KAPLAN','RAMADA','NY STATE BAR APPLIC FEE','greyhound'],
			
			'stash':['stash'],
			'coinbase':['COINBASE'],
			
			'mohini transfer':['Giri, Mohini'],
			'other transportation':['amtrak'],
			
		};
		var groupsColor={
			'allston convenience store':getRandomColor(),
			
			'shopping':getRandomColor(),
			
			'health':getRandomColor(),
			'bills':getRandomColor(),

			'vacation':getRandomColor(),

			'groccery':getRandomColor(),
			
			'restaurants and party':getRandomColor(),

			'uber_lyft':getRandomColor(),
			'public transportation':getRandomColor(),
			'irs':getRandomColor(),

			'TransferWise':getRandomColor(),
			'molly fee':getRandomColor(),
			
			'stash':getRandomColor(),
			'coinbase':getRandomColor(),
			
			'mohini transfer':getRandomColor(),
			'other transportation':getRandomColor(),
			
		};
	function getGroupName(fullName, getColor){
		
		function match(longNameString, groupsMap){
			for(var key in groups){
				for(var i = 0; i<groups[key].length; i++){
					var needle = groups[key][i].toLowerCase();
					var haystack = longNameString.toLowerCase();
					if(haystack.includes(needle)) return key;
				}
			}
			return false;
		}
		
		var x = match(fullName,groups);
		if(x){
			if(getColor){
				return groupsColor[x];
			}
			return x;
		}
		// console.log(fullName, ob);
		return getColor?'rgb(255,255,255)':'other';//fullName;//fullName.replace(/[\d+#]/g,'').substr(0,7);
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

	function getMonthlyBalance(monthlyData){
		var arr = [];
		for(var i = 0; i<monthlyData.length; i++){
			for(var j = 0; j<monthlyData[i].length; j++){
				if(monthlyData[i][j].balance!==null){
					arr[i] = monthlyData[i][j].balance	
				} 
			}
		}
		return arr;
	}

	this.monthlyData = monthlyData;
	this.monthlyBalance = getMonthlyBalance(this.monthlyData);
	this.monthlySavings = getMonthlySavingsData(this.monthlyData);
	this.monthlyExpenses = getMonthlyExpenseData(this.monthlyData);

	this.sortedMonthlyData = getMonthlySortedData(this.monthlyData);
	this.groupedMonthlyData = getGroupedMonthlyData(this.monthlyData);



// console.log(this.sortedMonthlyData);
	// console.log(this.groupedMonthlyData);


	function getPositiveValues(ob){
		var result = [];
		for(var key in ob){
			result.push(ob[key]>=0?ob[key]:ob[key]*-1);
		}
		return result;
	}
	function getKeys(ob){
		var result = [];
		for(var key in ob){
			result.push(key);
		}
		return result;
	}

this.createMultiScatterChartData = function(groupedMonthlyData){
	var data = {};
	for(var i = 0 ; i<groupedMonthlyData.length; i++){
		for(var key in groupedMonthlyData[i].data){
			if(!data[key]){
				data[key] = {x:[], y:[], type:'scatter', name:key};
			}
			data[key].x.push(months[i]);
			var expense = groupedMonthlyData[i]['data'][key];
			data[key].y.push(expense<0?expense *-1:expense);
		}
	}

	var result = [];
	for (var key in data){
		result.push(data[key]);
	}
	return result;
}

	this.drawCharts = function(){
		var element = document.createElement("div")
		element.id = 'charts';
		// element.className = 'col-md-8';
		TESTER = document.getElementById('dashboard').appendChild(element);
		createScatterChart('charts','balance',['jan', 'feb', 'mar','apr','may','jun'],this.monthlyBalance);
		createScatterChart('charts','savings',['jan', 'feb', 'mar','apr','may','jun'],this.monthlySavings);
		createScatterChart('charts','expenses',['jan', 'feb', 'mar','apr','may','jun'],this.monthlyExpenses);


		var element = document.createElement("div")
		element.id = 'bar_charts';
		// element.className = 'col-md-12';

		TESTER = document.getElementById('dashboard').appendChild(element);
		for(var i = 0; i<this.groupedMonthlyData.length; i++){
			values = getPositiveValues(this.groupedMonthlyData[i].data);
			labels = getKeys(this.groupedMonthlyData[i].data);
			createBarChart('bar_charts', months[i] + ' expenses', values,labels);
		}

		createMultiScatterChart('charts','grouped expense',this.createMultiScatterChartData(this.groupedMonthlyData));
	}

	this.writeData = function(){
		var element = document.createElement("div")
		element.id = 'data';
		TESTER = document.getElementById('dashboard').appendChild(element);
		// console.log(this.sortedMonthlyData);

		var data = '';
		for(var i = 0; i<this.sortedMonthlyData.length; i++){
			data += '<h3>'+months[i]+'</h3>';
			data +='<table>';
			for(var j= 0; j<this.sortedMonthlyData[i].length; j++){
				data +='<tr style="background-color:'+getGroupName(this.sortedMonthlyData[i][j]['name'], true)+'">';
				for(var key in this.sortedMonthlyData[i][j]){
					data +='<td>'+this.sortedMonthlyData[i][j][key]+'</td>';
				}
				data +='<td>'+getGroupName(this.sortedMonthlyData[i][j]['name'])+'</td>';
				// data += JSON.stringify(this.sortedMonthlyData[i][j]);
				data +='</tr>';


			}
			data +='</table>';
		}

		TESTER.innerHTML += data;
		// TESTER.innerHTML = (JSON.stringify(this.sortedMonthlyData[5]));
		// TESTER.innerHTML = (JSON.stringify(this.groupedMonthlyData));
	}



	this.draw = function(){
		this.drawCharts();
		this.writeData();
	}

		
		// Plotly.newPlot('jan_pc', data, layout);
}

	var records = convertAccountDataToOb(data, parsers);
	var monthlyData = (new monthloyDataParser(records)).getData();
	var dashboard = new Dashboard(monthlyData);
	dashboard.draw()
	// dashboard.drawCharts();
	// dashboard.writeData();
// createDashboard(data, [bofaDebitParser, bofaCreditParser], true);
// createDashboard(abhaKutiya, bofaDebitParser, true);
// createDashboard(data, bofaCreditParser, false);
// credit card data

// obs = convertAccountDataToOb(creditCardData, bofaCreditParser);
//1600 + 85 + 55 + 60 + 150 + 20 + 500 + 260 + 500 + 150 = 3380  + 500 enjoy = 3880 - 6916 ~ 3000 savings every month