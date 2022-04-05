import React, { useState } from 'react'

import Form from 'react-bootstrap/Form'

interface Props {
  name: string
  setName: (name: string) => void
  closeEditor: () => void
}

const NameEditor: React.FC<Props> = ({ name, setName, closeEditor }) => {
  const [value, setValue] = useState<string>(name)

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    if (value && value !== name) {
      setName(value)
    }
    closeEditor()
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Form
      noValidate
      onSubmit={handleSubmit}
      className={`nameEditor cancel-drag-board`}
    >
      <Form.Control
        autoFocus
        type='text'
        value={value}
        custom
        onChange={(v) => setValue(v.target.value)}
        onBlur={handleSubmit}
      />
    </Form>
  )
}

export default NameEditor
