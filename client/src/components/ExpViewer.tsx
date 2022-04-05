import React from 'react'

import { useQuery } from '@apollo/client'
import { GET_EXP_DATA } from '../apollo/exps'

import Loader from '../components/Loader'
import ExpTable from './ExpTable'
import QuillExpEditor from './QuillExpEditor'

import workIcon from '../images/icons/work.png'


interface Props {
  className?: string
  expName: string
  expId: number
}
const ExpViewer: React.FC<Props> = ({ className, expName, expId }) => {

  const expDataQuery = useQuery(GET_EXP_DATA, { variables: { expId: expId } })

  return (
    <Loader query={expDataQuery} queryType='experiement'>
      <div className={className} id='exp'>
        <h2>{expName}</h2>
        <img src={workIcon} alt='WORK IN PROGRESS' id='work'></img>
        <h2>WORK IN PROGRESS</h2>
        <h2>Reaction Table</h2>
        <ExpTable />

        <h2>Procedure</h2>
        <QuillExpEditor />
      </div>
    </Loader>
  )
 }

export default ExpViewer
