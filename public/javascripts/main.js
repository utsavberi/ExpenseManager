'use strict';
import {createElement, createScatterChart, createMultiScatterChart, createBarChart} from './charts.js'

var months = ['jan', 'feb', 'mar','apr','may','jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function getDateFromString(dateStr){
var parts =dateStr.split('-');
return new Date(parts[0], parts[1] - 1, parts[2]); 
}

function monthloyDataParser(records){
  this.records = records;
  this.getData = function(){
    const monthlyData = [];
    for(var i = 0; i<records.length; i++){
      if(!monthlyData[getDateFromString(records[i].date).getMonth()]){
        monthlyData[getDateFromString(records[i].date).getMonth()] = [];
      }
      monthlyData[getDateFromString(records[i].date).getMonth()].push(records[i]);
    }  
    return monthlyData;
  };
}

function Dashboard(monthlyData){

  function getMonthlyExpenseData(monthlyData){
    const expenses = [];
    for(let i = 0; i<monthlyData.length; i++){
      let sum = 0;
      for(let j = 0; j<monthlyData[i].length; j++){
        if(excludedTransactionIds.indexOf(monthlyData[i][j].transaction_id) < 0)
        {
          sum+=monthlyData[i][j].amount;
        }
      }
      expenses.push(sum);
    }
    return expenses;
  }

  function getMonthlySortedData(monthlyData){
    const copy = [...monthlyData];
    const result = [];
    for(let i = 0; i<copy.length; i++){
      result.push(copy[i].sort(function(a,b){return b.amount - a.amount;}));
    }
    return result;
  }

  function getRandomColor(){
    return 'hsl(' + 360 * Math.random() + ',' +
                 (25 + 70 * Math.random()) + '%,' + 
                 (85 + 10 * Math.random()) + '%)';
  }
  const excludedTransactionIds=[
  '5kOOjQrrwXHqKmddLo6mSkg04PK7OwsBaEX3P',//2018-09-14  Best Buy  false 1646.86 amex  Shops,Computers and Electronics other
'5YD4MEEXMRupoQwnp6LEi55Oazv96QhB8Jek8',//5YD4MEEXMRupoQwnp6LEi55Oazv96QhB8Jek8 2018-06-25  Zelle Transfer Conf# 103ba788e; abha  false 2500  bofa  Transfer,Debit  other
'Kkbdw99YwLF0eAbR0jKdTaak54JxbXtQwrMR3',// 2018-06-18  Zelle Transfer Conf# f9cac7d69; abha  false 1335  bofa  Transfer,Debit  other
'OjND100p1qIEr5ObEwPMCMMBOy0ZdjH8ErLAn',//2018-03-21  TransferWise Inc DES:utsav beri ID:32406687 INDN:utsav beri CO ID:XXXXX33521 IAT PMT INFO: REM 000000000000000000 FOR MORE INFORMATION CONTACT CUSTOMER SERVICE false 3500  bofa  Transfer,Debit  TransferWise'
  'XdNAvMMpvmI478Yo4yjRUPP7N591LeU4gRvJn',//todo why  2018-02-12  Zelle Transfer Conf# 477d21094; abha  false 2000  bofa  Transfer,Debit  other'
  'N0NLDQQpDPCLnQzZLdrOCnn86vqOVytRDVN7L',// todo why  2018-02-02  WAYFAIR* wayfair.com  false 1990.93 bofa  Shops,Furniture and Home Decor  shopping'
  '4Kee0RJJdXh7OYAA3ejYixJYw1zKMBFkpjYv9',// 2018-09-18  APPLE ONLINE STORE  false 328.31  amex  Shops,Computers and Electronics other
  '0qRRZVrr9Xib8jppr0Pji84YgKMkPwUrz1Lm3',//  2018-09-19  Abercrombie false 93.6  amex  Shops,Clothing and Accessories  other'
  'Ykqq3OjjDeHP4AYYXNKACJykQ1MYNoFQb6VML',//  2018-09-26  ALDOSHOES.COM 9920  false 63.2  amex  Service other'
'9nn8BXXJOH50kXXE37kueZwLj7nEguRoq47A',// 2018-10-12  UPS false 69.23 amex  Service,Shipping and Freight  other'
'yBqqmZXXLbtVDwaaANvwF6jZ1MKwzLfO8V6y9',//  2018-10-10  UPS false 13.08 amex  Service,Shipping and Freight  other'
  '4Kee0RJJdXh7OYAA3ejYixJYw1zKMBFkpjYkz',//  2018-07-22  JetBlue false 131.2 amex  Travel,Airlines and Aviation Services other'
  'j4Nb1ddO1ytR3oamR7EzFJJV7vjX3MUR69yrE',// 2018-04-10  SKINNYFITCOM  false 59.95 bofa  Food and Drink,Restaurants  other
'3Y6meOOXeQuMmn5QMOjzHbbNBwxxNqIKyamyL',//  2018-10-09  Online Banking payment to CRD 0273 Confirmation# 4113732109 false 468.65  bofa  Transfer,Debit  other'
'6Y1aMBBXMRuAO0ZyAbPzI99ZKo8NbvcaRPQb5',  //2018-04-05  Best Buy  false 2393.99 bofa  Shops,Computers and Electronics other'
'gb77p1zz4OHJyPqqB6oPs89DaQv3Z7UqVQ7yy',//  2018-09-14  WAYFAIR.COM false 311.05  amex  Shops,Furniture and Home Decor  shopping'
];
  const groups={
    'allston convenience store':['Circle K','ALLSTON CONVENIENCE STO PURCHASE','ALLSTON CONVENIENCE STOR','LEE\'S 2', '7-eleven','RICHDALE'],
      
    'shopping':['The Body Shop','BATHANDBODYWORKS','FABLETICS','SKINNYFITCOM','TONYDASH.COM','Bath & Body Works','Abercrombie','Zelle Transfer Conf# 9e11c72ff; abha','ELEMENTS BROOKLINE','MICHAEL KORS','CIRCLE K 07076 WEST FALMOUTHME','PRIMARK','amazon','TJMAXX','gap','target','BATH AND BODY WORKS','LUSH',
      'T.J.Maxx','LOCCITANE','H&M','BATH AND BODY WORKS','MAC','BARNES & NOBLE','VICTORIA','WAYFAIR','GROUPON','PRIME VIDEO', 'T.J. Maxx'],
      
    'health':['cvs','Walgreens'],
    'bills':['Groupon','MEMBERSHIP FEE','PAY U FERNS & PETALS PG','UPS','FedEx','Prudential Center Tower','bsc','Google','comcast','sprint','NATIONAL GRID','eversource','Field Corp','ROKU','SUPERCUTS','THREADING'],

    'vacation':['BKOFAMERICA ATM 02/25 #000007062 WITHDRWL ALLSTON','SANTANDER 02/16 #000481589 WITHDRWL 100 Huntington Av','Merry Christmas & All That Jazz','Magazine Spur','Tropical Isle Original','Maison','The Ruby Slipper Cafe',' Bayou Burger & Sports Company','THE RUMHOUSE','BKOFAMERICA ATM 05/26 #000007497 WITHDRWL ALLSTON','TRAVEL GUARD INSURANCE','Lufthansa','BKOFAMERICA ATM 05/26 #000007497 WITHDRWL ALLSTON ALLSTON MA','SPIRIT','NEW ORLEANS','INDIA HOUSE','SUGARLOAF','CAJUN ENCOUNTERS','BKOFAMERICA ATM 02/25 #000007062 WITHDRWL ALLSTON ALLSTON MA','SANTANDER 02/16 #000481589 WITHDRWL 100 Huntington Av Boston MA'],

    'groccery':['Walmart','BFRESH 2419','INSTACART','Patel Brothers','STAR','TRADER JOE\'S','ALLSTON MARKET'],
      
    'restaurants and party':['USA*FANTASY PHOTO BOOT','Boston Harbor Cruises','TARBOOSH PIZZA AND GRILL','Natalie\'s Pizzeria','LOTTO EXPRESS','Offshore Ale Company','THE ORIGINAL BOSTON FROSTY','WORLDPAY','40 - BOSTON','CHIK CHAK','MOOYAH','TST* SILVERTONE BAR & GR','Russell House Tavern','Seamless','EAT24','D ELLIES CARABASET','VENMO','Bernies','cask','charlies','eats','aubonpain','airport',
      'THE CHICKEN','TEMAZCAL','OAK BLUFFS','BCG/CENTERPLATE','MANO SALWA KABAB',
      'MAX BRENNER','WHISKEY','DOMINO', 'CUCHI CUCHI','FOODA','CHATIME','WAGAMAMA','MCDONALD','YARD HOUSE',
      'BAGUETTE','CHIPOTLE','BARCELONA','PANDA','EB HIDEOUT COMEDY','DUNKIN','MART','liquor','movie','REGAL','HOPEWELL','DURGIN PARK',
      'Charlie\'s Pizza', 'Subway', 'Au Bon Pain','SPLENDID BEER AND','GrubHub','ATOM TICKETS, LLC','SHAN-A-PUNJAB','Coppersmith',
      'Border Cafe','Papa John\'s','The Cheesecake Factory'],

    'uber_lyft':['uber','LYFT'],
    'public transportation':['LOGAN','mbta','COUMMUTER RAIL BACK BAY','GREEN LINE COPLEY','GREEN LINE KENMORE'],
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
    return getColor?'rgb(255,255,255)':'other';
  }
  function getGroupedMonthlyData(monthlyData){
    const groupedMonthlyData = [];
    for (let i = 0; i<monthlyData.length; i++){
      for(let j= 0; j<monthlyData[i].length; j++){
        if(excludedTransactionIds.indexOf(monthlyData[i][j].transaction_id) < 0){
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

  this.monthlyData = monthlyData;
  this.monthlyExpenses = getMonthlyExpenseData(this.monthlyData);

  this.sortedMonthlyData = getMonthlySortedData(this.monthlyData);
  this.groupedMonthlyData = getGroupedMonthlyData(this.monthlyData);

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
    const TESTER1 = document.getElementById('dashboard').appendChild(element1);
    // createScatterChart('charts','balance',months,this.monthlyBalance);
    // createScatterChart('charts','savings',months,this.monthlySavings);
    createScatterChart('charts','expenses',months,this.monthlyExpenses);


    const element2 = document.createElement('div');
    element2.id = 'bar_charts';

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

    let data = '<div style="clear:both"></div><div>';
    for(let i = this.sortedMonthlyData.length-1; i>=0; i--){
      data += '<h3>'+months[i]+'</h3>';
      data +='<table>';
      data +='<tr><th>transactionid</th><th>date</th><th>name</th><th>pending</th><th>amount</th><th>bank</th><th>internal category</th><th>assigned category</th></tr>';
      for(let j= 0; j<this.sortedMonthlyData[i].length; j++){
        if(excludedTransactionIds.indexOf(this.sortedMonthlyData[i][j]['transaction_id']) > -1 ){
          data +='<tr style="background-color: #ffffff;color: #d7d7d7;">'; 
        }
        else
        {
          data +='<tr style="background-color:'+getGroupName(this.sortedMonthlyData[i][j]['name'], true)+'">'; 
        }
        data +='<td>'+this.sortedMonthlyData[i][j]['transaction_id']+'</td>';
        data +='<td>'+this.sortedMonthlyData[i][j]['date']+'</td>';
        data +='<td>'+this.sortedMonthlyData[i][j]['name']+'</td>';
        data +='<td>'+this.sortedMonthlyData[i][j]['pending']+'</td>';  
        data +='<td>'+this.sortedMonthlyData[i][j]['amount']+'</td>';
        data +='<td>'+this.sortedMonthlyData[i][j]['bank']+'</td>';
        data +='<td>'+this.sortedMonthlyData[i][j]['category']+'</td>';
        data +='<td>'+getGroupName(this.sortedMonthlyData[i][j]['name'])+'</td>';
        data +='</tr>';


      }
      data +='</table></div>';
    }

    TESTER.innerHTML += data;
  };



  this.draw = function(){
    this.drawCharts();
    this.writeData();
  };

    
}

var monthlyData = (new monthloyDataParser(records)).getData();
var dashboard = new Dashboard(monthlyData);
dashboard.draw();
