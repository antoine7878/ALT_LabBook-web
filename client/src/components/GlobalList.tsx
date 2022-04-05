import React, { useState } from 'react'

import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { TOGGLE_ARCHIVE_GROUP, GET_GROUPS } from '../apollo/groups'
import { GET_COMPOUNDS_GLOBAL_LIST } from '../apollo/compound'
import { GET_EXP_BY_GROUP } from '../apollo/exps'

import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Collapse from 'react-bootstrap/Collapse'

import ScrollArrowWrapper from './ScrollArrowWrapper'
import { Group } from '../utils/types'
import Loader from '../components/Loader'

import { Compound, Exp } from '../utils/types'


interface PropsGlobalList {
  groups: Group[]
  className: string
}

interface PropsGroupItem {
  id: number
  name: string
  isArchived: boolean
}

const CompoundItem: React.FC<{ compound: Compound }> = ({ compound }) => {
  const [getExps, expsQuery] = useLazyQuery(GET_EXP_BY_GROUP,
    {
      variables: { compoundId: compound.id },
      fetchPolicy: 'cache-and-network'
    })

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
          <ListGroup.Item>
            <ListGroup variant='flush'>
              {expsQuery.data ?
                <>
                  {expsQuery.data.exps.length > 0 ?
                    expsQuery.data.exps.map((exp: Exp) => (
                      <ListGroup.Item key={exp.id}>
                        {exp.name}
                      </ListGroup.Item>
                    ))
                    :
                    <ListGroup.Item>
                      This compound has not been syntheised yet :(
                  </ListGroup.Item>}
                </>
                :
                <ListGroup.Item>
                  loading
              </ListGroup.Item>
              }
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>
      </Collapse>
    </ListGroup.Item >
  )
}

const GroupItem: React.FC<PropsGroupItem> = ({ id, name, isArchived }) => {
  const [getCompounds, compoundsQuery] = useLazyQuery(GET_COMPOUNDS_GLOBAL_LIST,
    {
      variables: { groupId: id },
      fetchPolicy: 'cache-and-network'
    })

  const [isOpened, setIsOpened] = useState(false)
  const [toggleArchived] = useMutation(TOGGLE_ARCHIVE_GROUP)

  const handleOpenGroup = (id: number) => {
    if (!isOpened) {
      getCompounds()
    }
    setIsOpened(!isOpened)
  }

  return (
    <ListGroup.Item>
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => handleOpenGroup(id)}
      >
        {name}
      </span>
      {id !== 0 && (
        <Form>
          <Form.Check
            type='checkbox'
            label='Archived'
            id={`${id}`}
            onChange={() => toggleArchived({ variables: { id } })}
            checked={isArchived || false}
          />
        </Form>
      )}
      <Collapse in={isOpened}>

        {compoundsQuery.data
          ?
          <div>
            <ListGroup variant='flush'>
              {compoundsQuery.data.compounds.map((compound: Compound) => (
                <CompoundItem compound={compound} key={compound.id} />
              ))}
            </ListGroup>
          </div>
          :
          <div>
            ca arrive
          </div>
        }
      </Collapse>
    </ListGroup.Item>
  )
}




const GlobalList: React.FC<PropsGlobalList> = ({ groups, className }) => {
  const groupsQuery = useQuery(GET_GROUPS)

  return (
    <Loader className={`${className} w-100`} query={groupsQuery} queryType='groups'>
      <div className='w-100'>
        <ScrollArrowWrapper scrollId='globalListjs'>
          <ListGroup className='globalListjs' id='globalListjs' variant='flush'>
            {groupsQuery.data.groups.map((group: any) => {
              return (
                <GroupItem id={group.id} name={group.name} isArchived={group.isArchived} key={group.id} />
              )
            })}
          </ListGroup>
        </ScrollArrowWrapper>
      </div>
    </Loader>
  )
}

export default GlobalList
