import { gql } from '@apollo/client'

//************************************************
//Query
//************************************************

export const GET_GROUPS = gql`
  query groups{
    groups { id, name, x, y, img, struct,isArchived, compoundLength }
  }
`

export const GET_COMPOUNDS_NUMBER = gql`
  query getCompoundsNumber($id: ID!) {
    compoundsNumber(id :$id)
  }
`
//************************************************
//Mutations
//************************************************

export const SET_COORDS = gql`
  mutation setCoordsGroup($id: ID!, $x: Float!, $y:Float!){
    setCoordsGroup(id: $id, x: $x, y: $y){
      id,x,y
    }
  }
`
export const ADD_GROUP = gql`
  mutation addGroup{
    addGroup{
      id,name,x,y,img,struct,isArchived
    }
  }
`


export const TOGGLE_ARCHIVE_GROUP = gql`
  mutation toggleIsArchivedGroup($id: ID!) {
    toggleIsArchivedGroup(id: $id){
      id, isArchived
    }
  }
`

export const DELETE_GROUP = gql`
  mutation deleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`

export const SET_NAME_GROUP = gql`
  mutation setNameGroup($id: ID!, $name: String!) {
    setNameGroup(id: $id, name: $name){
      id, name
    }
  }
`

export const SET_IMG_STRUCT_GROUP = gql`
  mutation setImgStructGroup($id: ID!, $img: String!, $struct: String!) {
    setImgStructGroup(id: $id, img: $img, struct: $struct){
      id, img, struct
    }
  }
`