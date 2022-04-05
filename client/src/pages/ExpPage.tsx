import React from 'react'
import MainNavBar from '../components/MainNavBar'

import ExpList from '../components/ExpList'
import ExpTabs from '../components/ExpTabs'

import * as __DEVDATA__ from '../utils/DEVDATA'

function ExpPage() {
  return (
    <React.Fragment>
      <MainNavBar />
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-2 w-25'>
            <ExpList />
          </div>
          <div className='col-10 w-75'>
            <ExpTabs expTabs={__DEVDATA__.expsTest} />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ExpPage
