const plaid = require('plaid');

var envvar = require('envvar');


const PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID');
const PLAID_SECRET = envvar.string('PLAID_SECRET');
const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY');
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');

const moment = require('moment');

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV],
  { version: '2018-05-22' },
);

function fetchTransactions( accessToken, startDate, endDate, pageSize, pageOffset, callback) {
  client.getTransactions(accessToken, startDate, endDate, {
    count: pageSize,
    offset: pageOffset,
  }, (error, transactionsResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      callback(error);
    } else if (transactionsResponse.transactions.length) {
    	callback(error,transactionsResponse.transactions);
    }
  });
}

module.exports = {
  fetchAllTransactions(accessToken, callback) {
    const startDate = moment().subtract(3, 'years').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    client.getTransactions(accessToken, startDate, endDate, {
      count: 1,
      offset: 0,
    }, (error, transactionsResponse) => {
      if (error != null) {
      	callback(error);
        prettyPrintResponse(error);
      } else {
        const totalTransactions = transactionsResponse.total_transactions;
        const pageSize = 500;
        let pageOffset = 0;
        let allTransactions = [];
        while (pageOffset <= totalTransactions) {
          fetchTransactions(accessToken, startDate, endDate, pageSize, pageOffset, function(err, transactions){
          	allTransactions = allTransactions.concat(transactions);
          	if(allTransactions.length>=totalTransactions){ //todo add max no of loops to prevent infinit loop
          		callback(null, allTransactions);
          	}
          });
          pageOffset += pageSize;
        }
      }
    });
  },
};
