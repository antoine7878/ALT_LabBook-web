import { gql } from '@apollo/client'

export const GET_EXP_BY_GROUP = gql`
  query exps($compoundId: ID!){
    exps(compoundId: $compoundId) {
        id, name, compoundId,createdAt
    }
  }
`
export const GET_EXP_DATA = gql`
  query expData($expId: ID!){
    exp(id: $expId){
      id, createdAt, name, procedure ,notes, reference 
    }
  }
`

export const GET_EXP_ID = gql`
  query expData($name: String!){
    expIdFromName(name: $name) {
      id, name
    }
  }
`

export const GET_EXP_LENGTH = gql`
  query expLength{
    expLength
  }
`

export const ADD_EXP = gql`
  mutation addExp($compoundId: ID!) {
    addExp(compoundId: $compoundId) {
      id, name,compoundId,createdAt
    }
  }
`