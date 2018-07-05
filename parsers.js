var parsers = {
	bofaDebitParser: function (line){
		tokens = line.split(',');
		t = line.match(/(".*?"),(".*?"),(".*?")/);
		name = t[1].substr(0,80);
		amount = parseFloat(t[2].split('"').join(''));
		balance = parseFloat(t[3].split('"').join(''));
		var ob = {date : new Date(tokens[0]),
			name:name,
			amount:amount,
			balance:balance
		}
		return ob;
	},

	bofaCreditParser:function (line){
		t = line.match(/(\d+\/\d+\/\d+)(,.*?,)(".*?"),(".*?"),(.*)/);
		date = new Date(t[1])
		name = t[3].substr(0,80);
		amount = parseFloat(t[5].split('"').join(''));
		balance = null;
		var ob = {date : date,
			name:name,
			amount:amount,
			balance:balance
		}
		return ob;
	},

	discovercreditcardparser:function (line){
		t = line.match(/(\d+\/\d+\/\d+),(\d+\/\d+\/\d+),(".*?"),(.*?),(".*?")/);
		date = new Date(t[1])
		name = t[3].substr(0,80);
		amount = parseFloat(t[4].split('"').join(''))*-1;
		balance = null;
		var ob = {date : date,
			name:name,
			amount:amount,
			balance:balance
		}
		return ob;
	},
}

function convertAccountDataToOb(input, parsers){
	var input = input.split('\n');
	obs = [];
	for(var i = 0; i<input.length; i++){
		ob = {};
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
	obs = obs.sort(function(a,b){return a.date - b.date});
	return obs;
}