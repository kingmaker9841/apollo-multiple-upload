const express = require('express');
const app = express();
require('dotenv').config();
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./config/typedefs');
const resolvers = require('./config/resolvers');

let server = new ApolloServer({
    typeDefs, resolvers, uploads: { maxFileSize: 1024*1024*2}
});

server.applyMiddleware({app});

let PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server Listening on port ${PORT} ...`);
})