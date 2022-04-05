import React, { useState } from 'react'

import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { openedCompoundViewer } from '../apollo/cache'
import { GET_COMPOUDS_BY_ID, SET_NAME_COMPOUND, SET_IMG_STRUCT_COMPOUND } from '../apollo/compound'
import { GET_EXP_BY_GROUP, ADD_EXP } from '../apollo/exps'
import { GET_EXP_LENGTH } from '../apollo/exps'

import { useHistory } from "react-router-dom";

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'

import { openExp } from '../utils/utilFunc'

import ChemEditorModal from './ChemEditorModal'
import NameEditor from './NameEditor'
import ScrollArrowWrapper from './ScrollArrowWrapper'
import Loader from '../components/Loader'

import { Exp } from '../utils/types'

interface Props {
  className?: string
}

const CompoundViewer: React.FC<Props> = ({ className }) => {

  const openedId = useReactiveVar(openedCompoundViewer)
  const compoundQ = useQuery(GET_COMPOUDS_BY_ID, { variables: { compoundId: openedId } })
  const expQ = useQuery(GET_EXP_BY_GROUP, { variables: { compoundId: openedId } })

  const [changeName] = useMutation(SET_NAME_COMPOUND)
  const [changeImgStruct] = useMutation(SET_IMG_STRUCT_COMPOUND)

  const [addExp] = useMutation(ADD_EXP, {
    variables: { compoundId: openedId },
    update(cache, { data: { addExp } }) {
      const currentExp = (cache.readQuery({
        query: GET_EXP_BY_GROUP,
        variables: { compoundId: openedId }
      }) as any).exps

      cache.writeQuery({
        query: GET_EXP_BY_GROUP,
        variables: { compoundId: openedId },
        data: { exps: [...currentExp, addExp] }
      })

      try {
        const expLength = (cache.readQuery({
          query: GET_EXP_LENGTH,
        }) as any).expLength

        cache.writeQuery({
          query: GET_EXP_LENGTH,
          data: { expLength: expLength + 1 }
        })
      } catch (e) {
        console.log(e)
      }
    }
  })

  const router = useHistory()

  const [showEditor, setShowEditor] = useState(false)
  const [nameIsEdited, setNameIsEdited] = useState(false)



  const handleOpenExp = (id: number, name: string) => {
    openExp(id, name)
    router.push('/exp')
  }
  const main = (openedId
    ?
    <Loader query={compoundQ} queryType='compound'>
      <ScrollArrowWrapper scrollId='testes'>
        <div className='compoundViewerjs--main' id='compoundViewerjs--main'>
          {nameIsEdited ? (
            <NameEditor
              name={compoundQ.data?.compound.name}
              closeEditor={() => {
                setNameIsEdited(false)
              }}
              setName={(name) => changeName({ variables: { id: openedId, name } })}
            />
          ) : (
              <h2
                onDoubleClick={() => {
                  setNameIsEdited(true)
                }}
              >
                {compoundQ.data?.compound.name}
              </h2>
            )}
          <img
            onDoubleClick={() => setShowEditor(true)}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              compoundQ.data?.compound.img
            )}`}
            alt={`${compoundQ.data?.compound.name} structure`}
            width={200}
            height={200}
            draggable={false}
            style={{ flexShrink: 0 }}
          />
          <h2>Synthesis</h2>
          <ListGroup variant='flush' className='compoundViewerjs--exps'>
            <Loader query={expQ} queryType='experiment'>
              {expQ.data?.exps.length ?
                expQ.data?.exps.slice().reverse().map((exp: Exp) => (
                  <ListGroup.Item key={exp.id} onDoubleClick={() => handleOpenExp(Number(exp.id), exp.name)}>
                    <div >{exp.name} </div>
                    <div>{exp.createdAt}</div>
                  </ListGroup.Item>)
                ) :
                <div>This compound has not been syntheised yet :(</div>
              }
            </Loader>
          </ListGroup>
        </div>
      </ScrollArrowWrapper>
    </Loader>
    :
    <div className="compoundViewerjs--main" >
      <h2>Double click on a compoud to open it</h2>
    </div >
  )


  return (
    <div className={className + ' compoundViewerjs'}>
      <ChemEditorModal
        show={showEditor}
        close={() => setShowEditor(false)}
        struct={compoundQ.data?.compound.struct}
        changeStructureImg={(struct, img) => changeImgStruct({ variables: { id: openedId, img, struct } })}

      />
      <div>
        <Button
          className="compoundViewerjs--button"
          variant="secondary"
          onClick={() => addExp()}
        >
          Add exp
            </Button>
      </div>
      <div className='compoundViewerjs--wrapper-main' id='compoundViewerjs--wrapper-main'>
        {main}
      </div>
    </div >
  )
}

export default React.memo(CompoundViewer)
