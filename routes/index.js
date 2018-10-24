

const express = require('express');

const router = express.Router();


const util = require('util');

var envvar = require('envvar');
const bodyParser = require('body-parser');
const moment = require('moment');
const plaid = require('plaid');

// models
const banks = require('../models/banks');
const transactions = require('../models/transactions');

const PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID');
const PLAID_SECRET = envvar.string('PLAID_SECRET');
const PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY');
const PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV],
  { version: '2018-05-22' },
);

function fetchAllBankTransactions(){
  banks.getAllBanks((err, banks)=>{
  for (var i in banks) {
      const bankName = banks[i].name;
      const accessToken = banks[i].accessToken;
      transactions.fetchAndSave(bankName, accessToken)
    }
  });
}

// fetchAllBankTransactions();
//todo make this only update to new transactions

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    PLAID_PUBLIC_KEY,
    PLAID_ENV,
  });
});

//todo add to db
// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
router.post('/get_access_token', (request, response, next) => {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    prettyPrintResponse(tokenResponse);
    response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
  });
});

// Retrieve Identity for an Item
// https://plaid.com/docs/#identity
router.get('/identity', (request, response, next) => {
  client.getIdentity(ACCESS_TOKEN, (error, identityResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(identityResponse);
    response.json({ error: null, identity: identityResponse });
  });
});

// Retrieve real-time Balances for each of an Item's accounts
// https://plaid.com/docs/#balance
router.get('/balance', (request, response, next) => {
  client.getBalance(ACCESS_TOKEN, (error, balanceResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(balanceResponse);
    response.json({ error: null, balance: balanceResponse });
  });
});

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
router.get('/accounts', (request, response, next) => {
  client.getAccounts(ACCESS_TOKEN, (error, accountsResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(accountsResponse);
    response.json({ error: null, accounts: accountsResponse });
  });
});

// Retrieve ACH or ETF Auth data for an Item's accounts
// https://plaid.com/docs/#auth
router.get('/auth', (request, response, next) => {
  client.getAuth(ACCESS_TOKEN, (error, authResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(authResponse);
    response.json({ error: null, auth: authResponse });
  });
});

// Retrieve information about an Item
// https://plaid.com/docs/#retrieve-item
router.get('/item', (request, response, next) => {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN, (error, itemResponse) => {
  	if (error != null) {
  		prettyPrintResponse(error);
  		return response.json({
  			error,
  		});
  	}
    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, (err, instRes) => {
    	if (err != null) {
    		const msg = 'Unable to pull institution information from the Plaid API.';
    		console.log(`${msg}\n${JSON.stringify(error)}`);
    		return response.json({
    			error: msg,
    		});
    	}
    		prettyPrintResponse(itemResponse);
    		response.json({
    			item: itemResponse.item,
    			institution: instRes.institution,
    		});
    });
  });
});

router.post('/set_access_token', (request, response, next) => {
  ACCESS_TOKEN = request.body.access_token;
  client.getItem(ACCESS_TOKEN, (error, itemResponse) => {
    response.json({
      item_id: itemResponse.item.item_id,
      error: false,
    });
  });
});

var prettyPrintResponse = (response) => {
  console.log(util.inspect(response, { colors: true, depth: 4 }));
};

module.exports = router;
