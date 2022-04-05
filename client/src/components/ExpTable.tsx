import { GraphQLSpecifiedByDirective } from 'graphql';
import React, { useState } from 'react'

import ReactDataSheet from 'react-datasheet';

interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  value: string | number | null;
}

const headerRow = [
  { value: 'Name' },
  { value: 'equiv' },
  { value: 'MW [g/mol]' },
  { value: 'n [mmol]' },
  { value: 'd' },
  { value: 'C [mol/L]' },
  { value: 'm [g]' },
  { value: 'v [mL}' },
]
const WIDTH = '140px'
const HEIGHT = '25px'

const emptyRow = () => Array.from({ length: 8 }, () => ({ value: null } as { value: number | null }))

const cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) => {
  return (
    <td onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver} onDoubleClick={props.onDoubleClick} className="cell" style={{ height: HEIGHT }}>
      {props.children}
    </td>
  )
}

const sheetRenderer: ReactDataSheet.SheetRenderer<GridElement, number> = (props) => (
  <table className={props.className + ' my-awesome-extra-class'}>
    <thead>
      <tr>
        {headerRow.map((col, index) => (<th style={{ width: WIDTH }} key={index}>{col.value}</th>))}
      </tr>
    </thead>
    <tbody>
      {props.children}
    </tbody>
  </table>
)

const dataEditor: ReactDataSheet.DataEditor<GridElement, number> = (props) => (

  <input className='customInput'
    style={{
      display: 'inline-block',
      width: WIDTH,
      height: HEIGHT,
      textAlign: 'left'
    }}
    autoFocus
    onChange={(e) => props.onChange(Number(e.target.value))}
  />
)


const ExpTable: React.FC<{}> = () => {

  const [grid, setGrid] = useState([emptyRow(), emptyRow(), emptyRow()])

  const onCellsChanged = (col: number, row: number, value: any) => {
    console.log(value)
    if (isNaN(value)) return
    setGrid((grid) => {
      return grid.map((r, indexRow) => r.map((cell, indexCol) => (
        (indexRow === row && indexCol === col) ? { ...cell, value } : cell
      )))
    })
  }

  return (
    <ReactDataSheet<GridElement, number>
      data={grid}
      valueRenderer={(cell) => cell.value}
      cellRenderer={cellRenderer}
      sheetRenderer={sheetRenderer}
      dataEditor={dataEditor}
      onCellsChanged={(a) => onCellsChanged(a[0].col, a[0].row, a[0].value)}
    />
  )
}

export default ExpTable
