import React, { useRef } from 'react'

import ChemEditor from './ChemEditor'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

interface Props {
  show: boolean
  close: () => void
  struct: string
  changeStructureImg: (mrv: string, svg: string) => void
}

const ChemEditorModal: React.FC<Props> = ({
  show,
  close,
  struct,
  changeStructureImg,
}) => {
  console.log('RENDER chem editor')
  const saveFunc = useRef<(() => void) | undefined>()

  const handleSave = () => {
    if (saveFunc.current) {
      saveFunc.current()
      close()
    }
  }

  return (
    <Modal
      show={show}
      onHide={close}
      backdrop='static'
      keyboard={false}
      dialogClassName='modal-90w'
      centered
    >
      <Modal.Body className='modal-chemEditor'>
        <ChemEditor
          // className='chemEditor'
          struct={struct}
          changeStructureImg={changeStructureImg}
          saveFunc={saveFunc}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='button-chem-editor'
          variant='secondary'
          onClick={handleSave}
        >
          Save changes
        </Button>
        <Button
          className='button-chem-editor'
          variant='secondary'
          onClick={close}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default React.memo(ChemEditorModal, (prv, nxt) => prv.show === nxt.show)
