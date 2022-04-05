import React from 'react'

import { useQuery } from '@apollo/client'
import { GET_GROUPS } from '../apollo/groups'

import MainNavBar from '../components/MainNavBar'
import GlobalList from '../components/GlobalList'
import Loader from '../components/Loader'

const __COL__ = 'col-10'

function ListPage() {
  const groupsQuery = useQuery(GET_GROUPS);


  return (
    <React.Fragment>
      <MainNavBar />
      <div className="container-fluid">
        <div className="row">
          <h3 className={__COL__}>Group List</h3>
        </div>
        <div className="row">
        <Loader className={__COL__} query={groupsQuery} queryType='groups'>
            {!groupsQuery.loading && <GlobalList groups={groupsQuery.data.groups} className={__COL__} />}
          </Loader>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ListPage
