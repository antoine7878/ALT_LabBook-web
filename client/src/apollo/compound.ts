import { gql } from '@apollo/client'


export const GET_COMPOUNDS = gql`
  query compounds($groupId: ID!){
    compounds(groupId: $groupId) {
        name,id,img,struct, groupId
    }
  }
`
export const GET_COMPOUNDS_GLOBAL_LIST = gql`
  query compounds($groupId: ID!){
    compounds(groupId: $groupId) {
        name,id,groupId
    }
  }
`


export const GET_COMPOUDS_BY_ID = gql`
  query compoundsById($compoundId: ID!) {
    compound(id: $compoundId){
      id, name, img, struct, groupId, 
    }
  }
`

export const ADD_COMPOUND = gql`
  mutation addCompound($groupId: ID!){
    addCompound(groupId: $groupId){
      name, id, img, struct, groupId
    }
  }
`

export const MOVE_COMPOUND = gql`
  mutation moveCompound($movingCompoundId: ID!, $destinationGroupId: ID!, $destinationPosition: ID!) {
    moveCompound(movingCompoundId: $movingCompoundId, destinationGroupId: $destinationGroupId, destinationPosition: $destinationPosition)
  }
`

export const SET_NAME_COMPOUND = gql`
  mutation setNameCompound($id: ID!, $name: String!) {
    setNameCompound(id: $id, name: $name){
      id, name
    }
  }
`

export const SET_IMG_STRUCT_COMPOUND = gql`
  mutation setImgStructCompound($id: ID!, $img: String!, $struct: String!) {
    setImgStructCompound(id: $id, img: $img, struct: $struct){
      id, img, struct
    }
  }
`