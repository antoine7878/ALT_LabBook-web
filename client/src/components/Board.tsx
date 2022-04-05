import React, { useState, useRef, useEffect, createRef } from 'react'

import { useMutation, gql, useApolloClient } from '@apollo/client';
import { SET_COORDS, ADD_GROUP, GET_GROUPS } from '../apollo/groups'
import { ADD_COMPOUND, GET_COMPOUNDS, MOVE_COMPOUND } from '../apollo/compound'

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Draggable from 'react-draggable'
import Button from 'react-bootstrap/Button'

import { Group, DragProps, DragCompound } from '../utils/types'

import GroupCard from './GroupCard'

import homeIcon from '../images/icons/home.png'


interface Props {
  groups: Group[]
  className?: string
}

interface didCompoundMovedInterface {
  isFirstHalf: undefined | boolean
  targetCompoundId: undefined | number
}

const Board: React.FC<Props> = ({ groups, className }) => {

  const [setCoords] = useMutation(SET_COORDS)
  const [moveCompound] = useMutation(MOVE_COMPOUND)
  const [addCompound] = useMutation(ADD_COMPOUND, {
    update(cache, { data: { addCompound } }) {

      const currentCompounds = (cache.readQuery({
        query: GET_COMPOUNDS,
        variables: { groupId: addCompound.groupId }
      }) as any).compounds

      cache.writeQuery({
        query: GET_COMPOUNDS,
        variables: { groupId: addCompound.groupId },
        data: { compounds: [...currentCompounds, addCompound] }
      })
    }
  })
  const [addGroup] = useMutation(ADD_GROUP, {
    update(cache, { data: { addGroup } }) {
      const currentGroups = (cache.readQuery({
        query: GET_GROUPS
      }) as any).groups

      cache.writeQuery({
        query: GET_GROUPS,
        data: { groups: [...currentGroups, addGroup] }
      })
    }
  })

  const apolloClient = useApolloClient()

  const DEFAULT_SCALE = 0.4
  const [boardScale, setBoardScale] = useState(DEFAULT_SCALE)
  const [pannable, setPannable] = useState(false)

  const selectDivRef = createRef<HTMLDivElement>()

  const dragging = useRef<boolean>(false)
  const target = useRef<DragCompound | null>(null)
  const dragCompound = useRef<DragCompound | null>(null)
  const dragCompoundNode = useRef<EventTarget | null>(null)
  const movingCompound = useRef<{ comp: any, groupId: number }>({ comp: null, groupId: 0 })
  const targetCompoundRef = useRef<{ groupId: number, destIndex: number }>({ groupId: 0, destIndex: 0 })

  const setTransformRef = useRef()
  const selectedIds = useRef<Set<number>>(new Set())
  const didCompoundMoved = useRef<didCompoundMovedInterface>({
    isFirstHalf: undefined,
    targetCompoundId: undefined,
  })
  const doScale = useRef(true)

  useEffect(() => {
    setTimeout(() => {
      handleResetTransform(setTransformRef.current)
    }, 50)
  }, []) // <-- empty dependency array does not reapeat at each render

  let x1: number, y1: number, x2: number, y2: number
  let x3: number, y3: number, x4: number, y4: number
  let offY = 120
  let startX = 0, startY = 0

  const handletDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    compound: DragCompound
  ) => {
    dragCompoundNode.current = e.target
    dragCompoundNode.current.addEventListener('dragend', handleDragEnd)
    dragCompound.current = compound


    movingCompound.current.comp = apolloClient.readQuery({
      query: GET_COMPOUNDS,
      variables: { groupId: dragCompound.current.groupId }
    }).compounds.find((c: any) => c.id === dragCompound.current?.compoundId.toString())

    setTimeout(() => {
      dragging.current = true
    }, 0)
  }
  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetCompound: DragCompound
  ) => {
    target.current = targetCompound
  }
  const handleOnDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetCompound: DragCompound
  ) => {
    e.preventDefault()

    //Checks is the drag compound moved from its initial postion
    if (
      dragCompound.current &&
      dragCompound.current.compoundId === targetCompound.compoundId
    )
      return

    let isFirstHalf
    if (targetCompound.compoundId !== -1) {

      //Get the firt #compound-drag-enter element on the HTML hierarchy #drag-compound-stop is the first element after -target
      let target: any = e.target
      while (target.id !== 'drag-compound-target') {
        target = target.parentElement
        if (target.id === 'drag-compound-stop') return
      }

      //Get the rectangle bounding the card
      const rect = target.getBoundingClientRect()
      isFirstHalf = e.clientX - rect.x < rect.width / 2

      //Return if the drag move did not crossed the middle of the compound card and not changed compoundCard
      if (
        didCompoundMoved.current.isFirstHalf === isFirstHalf &&
        didCompoundMoved.current.targetCompoundId === targetCompound.compoundId
      ) {
        didCompoundMoved.current = {
          isFirstHalf,
          targetCompoundId: targetCompound.compoundId,
        }
        return
      }
    }

    if (!dragCompound.current) return

    const newOriginCompounds = apolloClient.readQuery({
      query: GET_COMPOUNDS,
      variables: { groupId: dragCompound.current.groupId }
    }).compounds.filter((c: any) => c.id !== dragCompound.current?.compoundId.toString())

    apolloClient.writeQuery({
      query: GET_COMPOUNDS,
      variables: { groupId: dragCompound.current.groupId },
      data: { compounds: newOriginCompounds }
    })

    const destinationCompounds = [...apolloClient.readQuery({
      query: GET_COMPOUNDS,
      variables: { groupId: targetCompound.groupId }
    }).compounds]

    let destIndex: number = destinationCompounds.findIndex((c: any) => c.id === targetCompound.compoundId)
    if (!isFirstHalf) destIndex++

    destinationCompounds.splice(destIndex, 0, movingCompound.current.comp)

    apolloClient.writeQuery({
      query: GET_COMPOUNDS,
      variables: { groupId: targetCompound.groupId },
      data: { compounds: destinationCompounds }
    })

    //Changes the groupId of the drag compound in case the compound is moved to an other group before dropping
    targetCompoundRef.current = { groupId: targetCompound.groupId, destIndex: destIndex }
    if (dragCompound.current)
      dragCompound.current.groupId = targetCompound.groupId
  }



  const dragProps: DragProps = {
    dragging: dragging.current,
    dragCompound,
    handletDragStart,
    handleDragEnter,
    handleOnDragOver,
    target: target.current,
  }
  const handleDragEnd: EventListener = (e) => {

    moveCompound({
      variables: {
        movingCompoundId: Number(dragCompound.current?.compoundId),
        destinationGroupId: targetCompoundRef.current.groupId,
        destinationPosition: targetCompoundRef.current.destIndex
      }
    })

    movingCompound.current = { comp: null, groupId: 0 }
    targetCompoundRef.current = { groupId: 0, destIndex: 0 }
    dragging.current = false
    dragCompound.current = null
    if (dragCompoundNode.current) {
      dragCompoundNode.current.removeEventListener('dragend', handleDragEnd)
      dragCompoundNode.current = null
    }
  }

  const handleSetscale = (e: any) => {
    if (doScale.current) {
      setBoardScale(e.scale)
    }
  }
  const handleResetTransform = (setTransform: any) => {
    doScale.current = false
    setTransform(0, 0, DEFAULT_SCALE, 10, 'easeOut')
    setTimeout(() => {
      doScale.current = true
      setBoardScale(DEFAULT_SCALE)
    }, 200)
  }

  const reCalc = () => {
    const cur = selectDivRef.current
    if (!cur) return
    x3 = Math.min(x1, x2) //Smaller X
    x4 = Math.max(x1, x2) //Larger X
    y3 = Math.min(y1, y2) //Smaller Y
    y4 = Math.max(y1, y2) //Larger Y

    cur.style.left = `${x3}px`
    cur.style.top = `${y3 - offY}px`
    cur.style.width = `${x4 - x3}px`
    cur.style.height = `${y4 - y3}px`
  }

  const resetSelectedGroups = () => {
    let cards = document.getElementsByClassName('drag-handle groupCardjs')
    selectedIds.current = new Set()
    for (let i = 0; i < cards.length; i++) {
      const elem = cards[i]
      elem.className = 'drag-handle groupCardjs' // ???
    }
  }

  const handleOnMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {

    if (!(e as any).target.className?.includes('react-transform-component')) return
    resetSelectedGroups()

    if (!e.shiftKey) {
      setPannable(true)
    } else {
      const cur = selectDivRef.current
      if (cur) {
        cur.hidden = false
        x1 = e.pageX //Set the initial X
        y1 = e.pageY //Set the initial Y
        x2 = x1 //Set the initial X
        y2 = y1 //Set the initial Y
        reCalc()
      }
    }

  }

  const handleOnMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (selectDivRef.current?.hidden) return
    x2 = e.pageX //Update the current position X
    y2 = e.pageY //Update the current position Y
    reCalc()
  }

  const handleOnMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e as any).target.className?.includes('react-transform-component')) {
      setPannable(false)
    }

    const cur = selectDivRef.current
    if (!cur || cur.hidden) return
    cur.hidden = true
    let cards = document.getElementsByClassName('drag-handle groupCardjs')
    for (let i = 0; i < cards.length; i++) {
      const elem = cards[i]
      const rect = elem.getBoundingClientRect()
      const is =
        rect.left > x3 && rect.top > y3 && rect.right < x4 && rect.bottom < y4

      if (is) selectGroup(elem)
    }
    // utilsSetOndragsMultiple()
  }

  const selectGroup = (elem: Element) => {
    if (selectedIds.current.has(Number(elem.id))) {
      selectedIds.current.delete(Number(elem.id))
      elem.className = 'drag-handle groupCardjs'
    } else {
      selectedIds.current.add(Number(elem.id))
      elem.className += ' selected'
    }
  }

  const handleSetCoords = (id: number, x: number, y: number) => {
    setCoords({
      variables: { id, x, y },
      optimisticResponse: {
        __typename: 'Mutation',
        setCoordsGroup: {
          id,
          __typename: 'Group',
          x,
          y
        }
      }
    })
  }

  const handleOnStopDraggable = (
    _: any,
    pos: { x: number; y: number },
    groupId: number
  ) => {

    handleSetCoords(groupId, pos.x, pos.y)

    if (selectedIds.current.size > 1 && selectedIds.current.has(groupId)) {

      const deltaX = startX - pos.x
      const deltaY = startY - pos.y

      selectedIds.current.forEach(id => {
        if (id === groupId) return
        const data = apolloClient.readFragment({
          id: `Group:${id}`,
          fragment: gql`
              fragment ThisGroup on Group{
                x,y
            }
          `
        })
        handleSetCoords(id, data.x - deltaX, data.y - deltaY)
      })
    }
  }

  const handleOnClick = (e: any) => {
    const target = e.target
    if (
      e.ctrlKey &&
      target.className.includes(
        'drag-handle groupCardjs--cardBody card-body'
      ) &&
      target.id
    ) {
      selectGroup(target.parentElement.parentElement)
      console.log('group selected')
    }
  }
  const handleAddCompound = () => {
    if (selectedIds.current.size === 1) {
      addCompound({ variables: { groupId: selectedIds.current.values().next().value } })
    } else if (selectedIds.current.size === 0) {
      alert('Please select a detination group for the new compound')
    } else {
      alert('Please select only one detination group for the new compound')
    }
  }

  const GroupCards = groups.map((group: Group) => {
    const groupId = Number(group.id)
    return (
      <Draggable
        key={groupId}
        onStart={(_, pos) => { startX = pos.x; startY = pos.y }}
        onStop={(_, pos) => handleOnStopDraggable(_, pos, groupId)}
        handle='.drag-handle'
        cancel='.cancel-drag-board'
        scale={boardScale}
        position={{ x: group.x, y: group.y }}
      >
        <div>
          <GroupCard
            id={groupId}
            name={group.name}
            img={group.img}
            groupId={groupId}
            struct={group.struct}
            compoundLength={group.compoundLength}
            dragProps={dragProps}
          />
        </div>
      </Draggable>
    )
  })

  return (
    <div
      className={className + ' boardjs'}
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleOnMouseMove}
      onMouseUp={handleOnMouseUp}
      onClick={handleOnClick}
    >
      <div
        //selection div
        className='drag-handle'
        style={{
          border: '1px dotted #000',
          position: 'absolute',
          zIndex: 1000,
        }}
        ref={selectDivRef}
        draggable={false}
        hidden
      />
      <div>
        <Button
          className='boardjs--button'
          variant='secondary'
          onClick={handleAddCompound}
        >
          Add compound
        </Button>
        <Button
          className='boardjs--button'
          variant='secondary'
          onClick={() => addGroup()}
        >
          Add group
        </Button>
        <Button
          className='boardjs--button'
          variant='secondary'
          onClick={() => {
            handleResetTransform(setTransformRef.current)
          }}
        >
          <img
            className='homeButton'
            src={homeIcon}
            alt='expand'
            draggable='false'
            width='45%'
            height='45%'
          />
        </Button>
      </div>
      <TransformWrapper
        pan={{ disabled: !pannable }}
        options={{
          minScale: 0.1,
          limitToBounds: false,
          transformEnabled: true,
        }}
        doubleClick={{ disabled: true }}
        wheel={{ step: 8 }}
        onZoomChange={(e: any) => {
          handleSetscale(e)
        }}
        defaultScale={DEFAULT_SCALE}
        defaultPositionX={0}
        defaultPositionY={0}
      >
        {({ setTransform }: any) => {
          setTransformRef.current = setTransform
          return <TransformComponent>{GroupCards}</TransformComponent>
        }}
      </TransformWrapper>
    </div>
  )
}

export default Board
