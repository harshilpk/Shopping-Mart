const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://Harshil:dhoni@00731@cluster0-b0pi2.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No Database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
