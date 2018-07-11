function createElement(elementName, chartName, type,bootstrapClass, width){
	var element = document.createElement("div")
	element.id = chartName + '_' + type;
	element.className = type+'_chart '+bootstrapClass;
	element.style.width = width;
	element.style.float='left'
	TESTER = document.getElementById(elementName).appendChild(element);
	return TESTER
}
function createScatterChart(elementName, chartName, x, y){
	TESTER = createElement(elementName, chartName, 'scatterChart','', '50%');
	try{
		Plotly.plot( TESTER, [{
			x: ['jan', 'feb', 'mar','apr','may','jun'],
			y: y,
			type:'scatter',
		}], 
		{
			title: chartName,
			//margin: { t: 100 } 
		} );
	}catch(e){
		console.error('no internet connection')
	}
	
}

function createMultiScatterChart(elementName, chartName,data){
	TESTER = createElement(elementName, chartName, 'scatterChart','', '50%');
	try{
		Plotly.plot( TESTER, data, 
		{
			title: chartName,
			//margin: { t: 100 } 
		} );
	}catch(e){
		console.error('no internet connection')
	}
	
}
function createBarChart(elementName, title, values, labels){
	TESTER = createElement(elementName, title, 'pieChart','', '33.33%');
		try{

	var data = [{
		  values: values,
		  labels: labels,
		  type: 'pie'
		}];

		var layout = {
			title:title
		};

		Plotly.newPlot(TESTER, data, layout);
}catch(e){
		console.error('no internet connection')
	}
}