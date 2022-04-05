import React, { Fragment, useState } from 'react'

import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_COMPOUNDS } from '../apollo/compound'
import { TOGGLE_ARCHIVE_GROUP, DELETE_GROUP, SET_NAME_GROUP, SET_IMG_STRUCT_GROUP } from '../apollo/groups'

import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Collapse from 'react-bootstrap/Collapse'

import CompoundCard from './CompoundCard'
import ChemEditorModal from './ChemEditorModal'
import NameEditor from './NameEditor'

import { DRAG_COMPOUND_CLASS } from '../constants'

import expandIcon from '../images/icons/bottom-scroll-arrow.png'
import shrinkIcon from '../images/icons/top-scroll-arrow.png'

import { GROUP_IMG_SIZE } from '../constants'
import { DragProps } from '../utils/types'

interface Props {
  groupId: number
  name: string
  img: string
  struct: string
  dragProps: DragProps
  id: number
  compoundLength: number
}

const GroupCard: React.FC<Props> = ({
  groupId,
  name,
  img,
  struct,
  dragProps,
  id,
  compoundLength
}) => {
  const isDefault = groupId === 0

  // const isExpanded = (dragProps.dragging &&
  //   dragProps.target?.groupId === groupId)
  const isExpanded = true

  const [getCompounds, compoundsQuery] = useLazyQuery(GET_COMPOUNDS, { variables: { groupId: groupId } })

  const [toggleArchivedGroup] = useMutation(TOGGLE_ARCHIVE_GROUP)
  const [setNameGroup] = useMutation(SET_NAME_GROUP)
  const [setImgStructGroup] = useMutation(SET_IMG_STRUCT_GROUP)
  const [deleteGroup] = useMutation(DELETE_GROUP, {
    variables: { id: groupId },
    update(cache) {
      cache.modify({
        fields: {
          groups(existingGroups) {
            const newGroups = existingGroups.filter((grp: any) => grp.__ref !== `Group:${groupId}`)
            cache.evict({ id: `Group:${groupId}` })
            return newGroups

          }
        }
      })
    }
  })

  const [nameIsEdited, setNameIsEdited] = useState<boolean>(false)
  const [isExpandedLocal, setIsExpandedLocal] = useState<boolean>(isExpanded)
  const [showChemEditor, setShowChemEditor] = useState<boolean>(false)

  if (isExpandedLocal && !compoundsQuery.called) {
    getCompounds()
  }

  let compoundCards
  if (compoundsQuery.loading) {
    compoundCards = (
      <div>
        loading compounds
      </div>
    )
  } else if (compoundsQuery.error) {
    console.log('error loading groups: ', compoundsQuery.error)
    compoundCards = (
      <div>
        An error occured while loading groups
      </div>
    )

  } else if (compoundsQuery.data) {
    let compounds = compoundsQuery.data.compounds
    // compounds = compoundsQuery.data.compounds.slice().sort((a: any, b: any) => (a.index - b.index))

    compoundCards = (
      <Fragment>
        {compounds.length === 0 ? (
          <div
            className={'groupCardjs--dragshim'}
            onDragEnter={(e) =>
              dragProps.handleDragEnter(e, { groupId, compoundId: -1 })
            }
            onDragOver={(e) => {
              dragProps.handleOnDragOver(e, { groupId, compoundId: -1 })
            }}
          />
        ) : (
            compounds.map((compound: any) => (
              <div
                className={DRAG_COMPOUND_CLASS + 'YOUHOU'}
                id='drag-compound-target'
                key={compound.id}
                onDragStart={(e) =>
                  dragProps.handletDragStart(e, {
                    groupId,
                    compoundId: compound.id,
                  })
                }
                onDragEnter={(e) =>
                  dragProps.handleDragEnter(e, {
                    groupId,
                    compoundId: compound.id,
                  })
                }
                onDragOver={(e) => {
                  dragProps.handleOnDragOver(e, {
                    groupId,
                    compoundId: compound.id,
                  })
                }}
                draggable
              >
                {<CompoundCard compound={compound} groupId={groupId} />}
              </div>
            ))
          )}
      </Fragment>
    )
  }

  const handleDeleteGroup = () => {
    if (compoundLength === 0) {
      deleteGroup()
    } else {
      alert('Only empty groups can be removed')
    }
  }


  return (
    <Fragment>
      <ChemEditorModal
        struct={struct}
        changeStructureImg={(mrv: string, svg: string) =>
          setImgStructGroup({ variables: { id: groupId, img: svg, struct: mrv } })
        }
        show={showChemEditor}
        close={() => {
          setShowChemEditor(false)
        }}
      />
      <div
        className={'drag-handle groupCardjs'}
        id={id.toString()}
        onDragEnter={() => setIsExpandedLocal(true)}
      >
        <Card>
          {
            <Card.Header className={'groupCardjs--header'}>
              {nameIsEdited && !isDefault ? (
                <NameEditor
                  name={name}
                  closeEditor={() => {
                    setNameIsEdited(false)
                  }}
                  setName={(newName: string) =>
                    setNameGroup({ variables: { id: groupId, name: newName } })
                  }
                />
              ) : (
                  <span
                    onDoubleClick={() => {
                      setNameIsEdited(true)
                    }}
                  >
                    {name}
                  </span>
                )}
              {!isDefault && (
                <DropdownButton
                  title=''
                  className={'groupCardjs-m-dropdown cancel-drag-board'}
                  key='right'
                  id='test'
                  variant='light'
                >
                  <Dropdown.Item
                    eventKey='1'
                    onClick={() => toggleArchivedGroup({ variables: { id: groupId } })}
                    className={'cancel-drag-board'}
                  >
                    Archive group
                  </Dropdown.Item>
                  <Dropdown.Divider className={'cancel-drag-board'} />
                  <Dropdown.Item
                    eventKey='2'
                    onClick={() => setShowChemEditor(true)}
                    className={'cancel-drag-board'}
                  >
                    Edit structure
                  </Dropdown.Item>
                  <Dropdown.Divider className={'cancel-drag-board'} />
                  <Dropdown.Item
                    eventKey='2'
                    onClick={handleDeleteGroup}
                    className={'red cancel-drag-board'}
                  >
                    Delete group
                  </Dropdown.Item>
                </DropdownButton>
              )}
            </Card.Header>
          }

          {!isDefault && (
            <Card.Body
              className={'drag-handle groupCardjs--cardBody'}
              id={groupId.toString()}
            >
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(img)}`}
                draggable='false'
                alt={`${name} structure`}
                width={GROUP_IMG_SIZE}
                height={GROUP_IMG_SIZE}
              />
              <div
                className={
                  'groupCardjs--expand-buttons cancel-drag-board default-cursor'
                }
                onClick={() => setIsExpandedLocal(!isExpandedLocal)}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                }}
              >
                {isExpandedLocal ? (
                  <img
                    className={'groupCardjs--expand-icon'}
                    src={shrinkIcon}
                    alt='shrink'
                    draggable='false'
                  />
                ) : (
                    <img
                      className={'groupCardjs--expand-icon'}
                      src={expandIcon}
                      alt='expand'
                      draggable='false'
                    />
                  )}
              </div>
            </Card.Body>
          )}
          <Card.Footer className={'groupCardjs--footer cancel-drag-board'}>
            <Collapse in={isExpandedLocal}>
              <div
                className={'groupCardjs--compounds'}
                id='drag-compound-stop'
                style={{
                  gridTemplateColumns: 'auto '.repeat(
                    Math.ceil(Math.sqrt(compoundsQuery.data?.compounds.length))
                  ),
                }}
              >
                {compoundCards}
              </div>
            </Collapse>
          </Card.Footer>
        </Card>
      </div>
    </Fragment>
  )
}

const noUpdate = (prv: Props, nxt: Props) => {
  return (
    prv.name === nxt.name &&
    prv.img === nxt.img
  )
}

export default React.memo(GroupCard, noUpdate)
