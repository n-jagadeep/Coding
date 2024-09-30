const {ApolloServer} = require("apollo-server");
const {typeDefs} =require("./schema/type-defs");
const {resolvers} =require("./schema/resolvers");
const mongoose = require ("mongoose");

const MONGODB = "mongodb+srv://jxn59370:vbJJRIqX5gn5DRXr@cluster0.kbn6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const server = new ApolloServer ({typeDefs, resolvers});
mongoose.connect(MONGODB, {})
        .then(()=>{
            console.log("MongoDB Connection Successful");
            return server.listen({port: 4000});
        })
        .then((res)=>{
            console. log(`Server running at ${res.url}`);
        })
        .catch(err=>console.log(`error: ${err}`));

        
        