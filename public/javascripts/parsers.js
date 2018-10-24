'use strict';
const parsers = {
  bofaDebitParser: function (line){
    const tokens = line.split(',');
    const t = line.match(/(".*?"),(".*?"),(".*?")/);
    const name = t[1].substr(0,80);
    const amount = parseFloat(t[2].split('"').join(''));
    const balance = parseFloat(t[3].split('"').join(''));
    const ob = {date : new Date(tokens[0]),
      name:name,
      amount:amount,
      balance:balance
    };
    return ob;
  },

  bofaCreditParser:function (line){
    const t = line.match(/(\d+\/\d+\/\d+)(,.*?,)(".*?"),(".*?"),(.*)/);
    const date = new Date(t[1]);
    const name = t[3].substr(0,80);
    const amount = parseFloat(t[5].split('"').join(''));
    var ob = {date : date,
      name:name,
      amount:amount,
      balance:null
    };
    return ob;
  },

  discovercreditcardparser:function (line){
    const t = line.match(/(\d+\/\d+\/\d+),(\d+\/\d+\/\d+),(".*?"),(.*?),(".*?")/);
    const date = new Date(t[1]);
    const name = t[3].substr(0,80);
    const amount = parseFloat(t[4].split('"').join(''))*-1;
    const balance = null;
    var ob = {date : date,
      name:name,
      amount:amount,
      balance:balance
    };
    return ob;
  },
};

export default parsers;
