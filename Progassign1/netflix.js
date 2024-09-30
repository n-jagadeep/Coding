// Import necessary modules
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

// Connect to MongoDB Atlas using the hardcoded connection string
mongoose.connect('mongodb+srv://jxn59370:vbJJRIqX5gn5DRXr@cluster0.kbn6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose Schema for the Netflix collection
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  genres: [String],
  imdb_score: Number,
  runtime: Number,
  release_year: Number,
  type: String,
  age_certification: String,
  production_countries: [String],
});

// Create a Mongoose model for the Netflix collection
const Movie = mongoose.model('Movie', movieSchema);

// Define GraphQL type definitions
const typeDefs = gql`
  type Movie {
    title: String
    description: String
    genres: [String]
    imdb_score: Float
    runtime: Int
    release_year: Int
    type: String
    age_certification: String
    production_countries: [String]
  }

  type Query {
    getAllMovies: [Movie]
    getMovieByTitle(title: String!): Movie
  }

  type Mutation {
    createMovie(
      title: String!
      description: String!
      genres: [String]!
      imdb_score: Float
      runtime: Int
      release_year: Int
      type: String!
      age_certification: String!
      production_countries: [String]!
    ): Movie

    updateMovie(
      title: String!
      description: String
      runtime: Int
      genres: [String]
      imdb_score: Float
    ): Movie

    deleteMovie(title: String!): String
  }
`;

// Define GraphQL resolvers
const resolvers = {
  Query: {
    getAllMovies: async () => await Movie.find(),
    getMovieByTitle: async (_, { title }) => await Movie.findOne({ title }),
  },
  Mutation: {
    createMovie: async (_, args) => {
      const newMovie = new Movie(args);
      return await newMovie.save();
    },
    updateMovie: async (_, { title, description, runtime, genres, imdb_score }) => {
      return await Movie.findOneAndUpdate(
        { title },
        { description, runtime, genres, imdb_score },
        { new: true }
      );
    },
    deleteMovie: async (_, { title }) => {
      await Movie.findOneAndDelete({ title });
      return `Movie or show with title "${title}" was deleted.`;
    },
  },
};

// Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

