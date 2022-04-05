import React from 'react'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_EXP_LENGTH, GET_EXP_ID } from '../apollo/exps'

import { openExp } from '../utils/utilFunc'

import ListGroup from 'react-bootstrap/ListGroup'
import Loader from './Loader'
import ScrollArrowWrapper from './ScrollArrowWrapper'


interface Props {
  className?: string
}

const ExpList: React.FC<Props> = ({ className }) => {

  const expLengthQuery = useQuery(GET_EXP_LENGTH)
  const expLength = expLengthQuery.data?.expLength

  const [getExpId] = useLazyQuery(GET_EXP_ID, {
    onCompleted(data) {
      openExp(data.expIdFromName.id, data.expIdFromName.name)
    }
  })

  const handleOpeneExp = (name: string) => {
    getExpId({ variables: { name } })
  }
  return (
    <Loader className={'expList' + className} query={expLengthQuery} queryType='exp number'>
      <h3>expList</h3>
      <ScrollArrowWrapper scrollId='scrollId-expList'>
        <ListGroup id='scrollId-expList' >
          {(new Array(expLength)).fill(1).map((_, index) => {
            const expName = 'ALT-' + (expLength - index).toString().padStart(3, '0')
            return (
              <ListGroup.Item
                key={expName}
                className='expList'
                onClick={() => handleOpeneExp(expName)}
              >
                {expName}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </ScrollArrowWrapper>
    </Loader >
  )
}

export default ExpList
