import React from 'react'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { useReactiveVar } from '@apollo/client'
import { openedExp } from '../apollo/cache'
// import { Exp } from '../utils/types'

import ExpViewer from './ExpViewer'


interface Props {
  expTabs: any[]
}

const ExpTabs: React.FC<Props> = ({ expTabs }) => {

  const openedExpHook = useReactiveVar(openedExp)

  const handleChangeTab = (id: number) => {
    openedExp({
      ...openedExp(),
      currentId: id
    })
    console.log(openedExp())
  }

  return (
    <div className='border w-100' style={{ padding: 10 }}>
      {expTabs.length === 0 ? (
        <div>
          <p> no exp opened</p>
        </div>
      ) : (
          <Tabs
            mountOnEnter
            id='expsTab'
            activeKey={openedExpHook.currentId}
            onSelect={(id) => id && handleChangeTab(Number(id))}
          >
            {openedExpHook.opened.map(({ name, id }) => {
              return (

                <Tab title={name}
                  eventKey={id.toString()}
                  key={id}
                >
                  <ExpViewer expName={name} expId={id} />
                </Tab>
              )
            })}
          </Tabs>
        )}
    </div>
  )
}

export default ExpTabs
