import React, { useState } from 'react'

import { useLazyQuery } from '@apollo/client';
import { GET_EXP_BY_GROUP } from '../apollo/exps'

import ListGroup from 'react-bootstrap/ListGroup'
import Collapse from 'react-bootstrap/Collapse'

import { Compound } from '../utils/types'

interface Props {
  compounds: Compound[]
}

const CompoundItem: React.FC<{ compound: Compound }> = ({ compound }) => {
  const [getExps, expsQuery] = useLazyQuery(GET_EXP_BY_GROUP,
    {
      variables: { compoundId: compound.id },
      fetchPolicy: 'cache-and-network'
    })
  console.log(expsQuery.data)
  const [isOpened, setIsOpened] = useState(false)

  const handleOpen = () => {
    if (!isOpened) {
      getExps()
    }
    setIsOpened(!isOpened)
  }
  return (
    <ListGroup.Item >
      <div
        onClick={handleOpen}
        className='list-title'
      >
        {compound.name}
      </div>
      <Collapse in={isOpened}>
        <ListGroup variant='flush'>
          <ListGroup.Item>Exps</ListGroup.Item>
        </ListGroup>
      </Collapse>
    </ListGroup.Item >
  )
}


const GlobalListGroup: React.FC<Props> = ({ compounds }) => {
  return (
    <ListGroup variant='flush'>
      {compounds.map((compound) => (
        <CompoundItem compound={compound} key={compound.id}/>
      ))}
    </ListGroup>
  )
}

export default GlobalListGroup
