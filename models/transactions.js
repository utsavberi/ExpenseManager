const MongoClient = require('mongodb').MongoClient;
const dao = require('../daos/plaid_dao');
const uri = 'mongodb://localhost/expensemanager';

function addColumn(arr, name, value) {
  for (let i = 0; i < arr.length; i++) {
    arr[i][name] = value;
  }
}

module.exports = {
  fetchAndSave(bankName, accessToken) {
    dao.fetchAllTransactions(accessToken, (err, transactions) => {
      if (err) {
        prettyPrintResponse(err);
      }
      if (transactions.length) {
        MongoClient.connect(uri, (err, mongoclient) => {
          if (err) {
            prettyPrintResponse(err);
          }
          const collection2 = mongoclient.db('expensemanager').collection('transactions');
          addColumn(transactions, 'bank', bankName);
          collection2.insertMany(transactions, (err, succ) => {
            if (err) {
              prettyPrintResponse(err);
            }
          });
          mongoclient.close();
        });
      }
    });
  },
  getAllTransactions(callback){
    MongoClient.connect(uri, (err, mongoclient) => {
      if (err) {
        prettyPrintResponse(err);
      }
      const collection2 = mongoclient.db('expensemanager').collection('transactions');
      collection2.find({
        "$and":[
          {
            "$expr":{
              "$eq":[
                {
                  "$year":{
                    "$dateFromString":{
                      "dateString":"$date",
                      "format":"%Y-%m-%d"
                    }
                  }
                },
                2018
              ]
            }
          },
          {
            "category":{
              "$nin":[
                [
                  "Payment",
                  "Credit Card"
                ]
              ]
            }
          },
          {"amount":{"$gt": 0}}
        ]
      })
      .toArray(function(err, docs){
        callback(err, docs);
        mongoclient.close();

      });
    });
  }
};
