import React from 'react'
import MainNavBar from '../components/MainNavBar'

import { useQuery } from '@apollo/client'
import { GET_GROUPS } from '../apollo/groups'

import Board from '../components/Board'
import CompoundViewer from '../components/CompoundViewer'
import Loader from '../components/Loader'

function BoardPage() {
  const groupsQuery = useQuery(GET_GROUPS);

  return (
    <React.Fragment>
      <MainNavBar />
      <div className="container-fluid">
        <div className="row">
          <h3 className="col-9">Overview board</h3>
          <h3 className="col-3">Compound Viewer</h3>
        </div>
        <div className="row" style={{ height: '90vh' }}>
          <Loader className='col-9' query={groupsQuery} queryType='groups'>
            {!groupsQuery.loading && !groupsQuery.error && <Board groups={groupsQuery.data.groups.filter((g:any) => !g.isArchived)} className="col-9" />}
          </Loader>
          <CompoundViewer className="col-3"/>
        </div>
      </div>
    </React.Fragment>
  )
}

export default BoardPage
