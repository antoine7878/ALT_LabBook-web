import { GraphQLServer } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client'


import Mutation from './resolvers/Mutation/Mutation'
import * as Query from './resolvers/Query'
import * as Group from './resolvers/Group'
// import * as Compound from './resolvers/Compound'

const resolvers = {
  Query,
  // ...Compound,
  Group,
  Mutation,
}

const prisma = new PrismaClient()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => ({
    ...request,
    prisma,
  })
})
server.start(() => console.log(`Server is running on http://localhost:4000`))