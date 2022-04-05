import React from 'react'

import { openedCompoundViewer } from '../apollo/cache'

import Card from 'react-bootstrap/Card'

import { Compound } from '../utils/types'
import { COMPOUND_IMG_SIZE } from '../constants'

interface Props {
  groupId: number
  compound: Compound
}

const CompoundCard: React.FC<Props> = ({ compound, groupId }) => {
  const { name, img, id } = compound
  
  const handleOpenCompound = () => {
    openedCompoundViewer(id)
  }

  return (
    <Card
      className={'compound-card'}
      style={{ maxWidth: COMPOUND_IMG_SIZE + 12 }}
    >
      <Card.Header>
        <div className={'compoundCard-compound-name'}>{name}</div>
      </Card.Header>
      <Card.Body
        className={'compoundCard-cardBody'}
        onDoubleClick={handleOpenCompound}
      >
        <img
          className={'mol-img'}
          src={`data:image/svg+xml;utf8, ${encodeURIComponent(img)}`}
          alt={`${name} sctructure`}
          draggable='false'
          width={COMPOUND_IMG_SIZE}
          height={COMPOUND_IMG_SIZE}
        />
      </Card.Body>
    </Card>
  )
}

export default CompoundCard
