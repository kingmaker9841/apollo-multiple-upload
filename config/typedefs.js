const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        uploads : [singleUploadResult]!
    }
    type Mutation {
        singleUpload (file : Upload!) : singleUploadResult
        multipleUpload (files: [Upload]!) : [singleUploadResult]
    }
    type singleUploadResult {
        filename : String!
        encoding: String!
        mimetype: String!
        location: String!
    }
`;

module.exports = typeDefs;

