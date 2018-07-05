function createBalanceChart(obs){
	x = [];
	y=[];
	var plots = [];

	for(var i = 0; i< obs.length; i++){
		if(obs[i].balance){
			var ob = {
				x:obs[i].date,y:obs[i].balance
			};
			plots.push(ob);
			x.push(obs[i].date.toLocaleString());
			y.push(obs[i].balance);
		}
	}
	TESTER = document.getElementById('tester');
	Plotly.plot( TESTER, [{
		x: x,
		y: y,
		type:'scatter',
	}], 
	{
		title: 'balance',
		// margin: { t: 0 } 
	} );
}
function createExpenseChart(expenses){
	var element = document.createElement("div")
	TESTER = document.getElementById('dashboard').appendChild(element);
	Plotly.plot( TESTER, [{
		x: ['jan', 'feb', 'mar','apr','may','jun'],
		y: expenses,
		type:'scatter',
	}], 
	{
		title: 'Monthly Expense',
		// margin: { t: 0 } 
	} );
}
function createSavingsChart(savings){
	TESTER = document.getElementById('tester2');
	Plotly.plot( TESTER, [{
		x: ['jan', 'feb', 'mar','apr','may','jun'],
		y: savings,
		type:'scatter',
	}], 
	{
		title: 'Monthly savings',
		//margin: { t: 100 } 
	} );
}