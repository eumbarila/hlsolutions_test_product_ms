const express = require('express');
const cassandra = require('cassandra-driver');
const errorMiddleware = require("./middlewares/error.middleware");
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

var productsRoutes = require('./routes/products.routes');

/**
 * Cassandra client for connecting to the database.
 *
 * @type {cassandra.Client}
 */
const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME, process.env.CASSANDRA_PASSWORD),
});

client.connect(function(err, result){
  console.log('App: cassandra connected');
});

app.listen(port, () => {
  console.log(`App in http://localhost:${port}`);
});

app.use(express.json());
app.use('/products', productsRoutes);
app.use(errorMiddleware);