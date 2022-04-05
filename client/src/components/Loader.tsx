import React from 'react'
import { QueryResult } from '@apollo/client'

interface Props {
  query: QueryResult<any, Record<string, any>>
  className?: string
  queryType: string
}

const Loader: React.FC<Props> = ({ query, className, queryType, children }) => {

  return (
    <>
      {query.loading ?
        <div className={className}>Loading {queryType}</div> :
        <>
          {query.loading ?
            <div className={className}>Loading {queryType}</div> :
            <>{children}</>
          }
        </>
      }
      {query.error &&
        <div className={className}>
          An error occured while loading {queryType}
        </div>
      }
    </>
  )
}


export default Loader