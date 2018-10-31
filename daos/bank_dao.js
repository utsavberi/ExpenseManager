const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost/expensemanager';

module.exports = {
  getAllBanks: function(callback) {
    MongoClient.connect(uri, (err, mongoclient) => {
      if (err) {
        console.log('Error occurred while connecting to db...\n', err);
      }
      console.log('Connected to mongo db...');
      const collection = mongoclient.db('expensemanager').collection('banks');
	  collection.find().toArray(callback);
      mongoclient.close();
    });
  },
};
