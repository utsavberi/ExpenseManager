'use strict';
import parsers from './parsers.js';
import {createElement, createScatterChart, createMultiScatterChart, createBarChart} from './charts.js'
import data from './data.js'

function convertAccountDataToOb(str, parsers){
  const input = str.split('\n');
  const obs = [];
  for(var i = 0; i<input.length; i++){
    let ob = {};
    try{
      ob = parsers.bofaDebitParser(input[i]);
    }catch(e){
      try{
        ob = parsers.bofaCreditParser(input[i]);
      }catch(e){
        ob = parsers.discovercreditcardparser(input[i]);
      }
    }
    obs.push(ob);
  }
  return obs.sort(function(a,b){return a.date - b.date;});
}

var months = ['jan', 'feb', 'mar','apr','may','jun'];


function monthloyDataParser(records){
  this.records = records;
  this.getData = function(){
    const monthlyData = [];
    for(var i = 0; i<records.length; i++){
      if(!monthlyData[records[i].date.getMonth()]){
        monthlyData[records[i].date.getMonth()] = [];
      }
      monthlyData[records[i].date.getMonth()].push(records[i]);
    }  
    return monthlyData;
  };
}

function Dashboard(monthlyData){

  function getMonthlySavingsData(monthlyData){
    const savings = [];
    for(let i = 0; i<monthlyData.length; i++){
      let first = null;
      let last = null;
      for(let j = 0; j<monthlyData[i].length; j++){
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
    const expenses = [];
    for(let i = 0; i<monthlyData.length; i++){
      let sum = 0;
      for(let j = 0; j<monthlyData[i].length; j++){
        if(monthlyData[i][j].amount<0){
          sum+=monthlyData[i][j].amount;
        }
      }
      expenses.push( sum*-1);
    }
    return expenses;
  }

  function getMonthlySortedData(monthlyData){
    const copy = [...monthlyData];
    const result = [];
    for(let i = 0; i<copy.length; i++){
      result.push(copy[i].sort(function(a,b){return a.amount - b.amount;}));
    }
    return result;
  }

  function getRandomColor(){
    return 'hsl(' + 360 * Math.random() + ',' +
                 (25 + 70 * Math.random()) + '%,' + 
                 (85 + 10 * Math.random()) + '%)';
  }
  const groups={
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
  const groupsColor={
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
      for(let key in groups){
        for(let i = 0; i<groups[key].length; i++){
          const needle = groups[key][i].toLowerCase();
          const haystack = longNameString.toLowerCase();
          if(haystack.includes(needle)) return key;
        }
      }
      return false;
    }
    
    const x = match(fullName,groups);
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
    const groupedMonthlyData = [];
    for (let i = 0; i<monthlyData.length; i++){
      for(let j= 0; j<monthlyData[i].length; j++){
        if(monthlyData[i][j].amount<0)
        {
          if(!groupedMonthlyData[i]){
            groupedMonthlyData[i] = [];
          }
          const groupName = getGroupName(monthlyData[i][j].name);
          if(!groupedMonthlyData[i][groupName]){
            groupedMonthlyData[i][groupName] = 0;

            groupedMonthlyData[i][groupName] = 0;
          }
          groupedMonthlyData[i][groupName] +=monthlyData[i][j].amount;
        }
      }
    }
    const groupedMonthlyDataOb = [];
    for(let i = 0; i<groupedMonthlyData.length; i++){
      const ob = {data:{}, month:i, monthName:months[i]};
      for(let key in groupedMonthlyData[i]){
        ob['data'][key] = groupedMonthlyData[i][key];
      }
      groupedMonthlyDataOb.push(ob);
    }
    return groupedMonthlyDataOb;
  }

  function getMonthlyBalance(monthlyData){
    const arr = [];
    for(let i = 0; i<monthlyData.length; i++){
      for(let j = 0; j<monthlyData[i].length; j++){
        if(monthlyData[i][j].balance!==null){
          arr[i] = monthlyData[i][j].balance;  
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
    const result = [];
    for(let key in ob){
      result.push(ob[key]>=0?ob[key]:ob[key]*-1);
    }
    return result;
  }
  function getKeys(ob){
    const result = [];
    for(var key in ob){
      result.push(key);
    }
    return result;
  }

  this.createMultiScatterChartData = function(groupedMonthlyData){
    const data = {};
    for(let i = 0 ; i<groupedMonthlyData.length; i++){
      for(let key in groupedMonthlyData[i].data){
        if(!data[key]){
          data[key] = {x:[], y:[], type:'scatter', name:key};
        }
        data[key].x.push(months[i]);
        var expense = groupedMonthlyData[i]['data'][key];
        data[key].y.push(expense<0?expense *-1:expense);
      }
    }

    const result = [];
    for (let key in data){
      result.push(data[key]);
    }
    return result;
  };

  this.drawCharts = function(){
    const element1 = document.createElement('div');
    element1.id = 'charts';
    // element.className = 'col-md-8';
    const TESTER1 = document.getElementById('dashboard').appendChild(element1);
    createScatterChart('charts','balance',['jan', 'feb', 'mar','apr','may','jun'],this.monthlyBalance);
    createScatterChart('charts','savings',['jan', 'feb', 'mar','apr','may','jun'],this.monthlySavings);
    createScatterChart('charts','expenses',['jan', 'feb', 'mar','apr','may','jun'],this.monthlyExpenses);


    const element2 = document.createElement('div');
    element2.id = 'bar_charts';
    // element.className = 'col-md-12';

    const TESTER2 = document.getElementById('dashboard').appendChild(element2);
    for(var i = 0; i<this.groupedMonthlyData.length; i++){
      const values = getPositiveValues(this.groupedMonthlyData[i].data);
      const labels = getKeys(this.groupedMonthlyData[i].data);
      createBarChart('bar_charts', months[i] + ' expenses', values,labels);
    }

    createMultiScatterChart('charts','grouped expense',this.createMultiScatterChartData(this.groupedMonthlyData));
  };

  this.writeData = function(){
    const element = document.createElement('div');
    element.id = 'data';
    const TESTER = document.getElementById('dashboard').appendChild(element);
    // console.log(this.sortedMonthlyData);

    let data = '';
    for(let i = 0; i<this.sortedMonthlyData.length; i++){
      data += '<h3>'+months[i]+'</h3>';
      data +='<table>';
      for(let j= 0; j<this.sortedMonthlyData[i].length; j++){
        data +='<tr style="background-color:'+getGroupName(this.sortedMonthlyData[i][j]['name'], true)+'">';
        for(let key in this.sortedMonthlyData[i][j]){
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
  };



  this.draw = function(){
    this.drawCharts();
    this.writeData();
  };

    
  // Plotly.newPlot('jan_pc', data, layout);
}

var records = convertAccountDataToOb(data, parsers);
var monthlyData = (new monthloyDataParser(records)).getData();
var dashboard = new Dashboard(monthlyData);
dashboard.draw();
// dashboard.drawCharts();
// dashboard.writeData();
// createDashboard(data, [bofaDebitParser, bofaCreditParser], true);
// createDashboard(abhaKutiya, bofaDebitParser, true);
// createDashboard(data, bofaCreditParser, false);
// credit card data

// obs = convertAccountDataToOb(creditCardData, bofaCreditParser);
//1600 + 85 + 55 + 60 + 150 + 20 + 500 + 260 + 500 + 150 = 3380  + 500 enjoy = 3880 - 6916 ~ 3000 savings every month