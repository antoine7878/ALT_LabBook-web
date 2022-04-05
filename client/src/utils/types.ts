import React from 'react'

export interface Group {
  name: string
  x: number
  y: number
  id: number
  img: string
  struct: string
  isArchived: boolean
  compoundLength: number
}

export interface Compound {
  id: number
  groupId: number
  name: string
  img: string
  struct: string
}

export interface Exp {
  name: string
  createdAt: string
  id: number
  opened: boolean
}

export interface DragCompound {
  groupId: number
  compoundId: number
}

export interface DragProps {
  dragging: boolean
  dragCompound: React.MutableRefObject<DragCompound | null>
  handletDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    compound: DragCompound
  ) => void
  handleDragEnter: (
    e: React.DragEvent<HTMLDivElement>,
    targetCompound: DragCompound
  ) => void
  handleOnDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    targetCompound: DragCompound
  ) => void
  target: DragCompound | null
}
