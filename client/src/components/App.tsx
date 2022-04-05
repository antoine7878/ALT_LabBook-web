import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloClient, ApolloProvider } from '@apollo/client'

import { cache } from '../apollo/cache'


import BoardPage from '../pages/BoardPage'
import ListPage from '../pages/ListPage'
import ExpPage from '../pages/ExpPage'

import 'react-datasheet/lib/react-datasheet.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import 'react-datasheet/lib/react-datasheet.css';

import '../styles/main.scss'

const uri = 'http://localhost:4000'

const apolloClient = new ApolloClient({ uri, cache })

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Switch>
          <Route path='/' component={BoardPage} exact />
          <Route path='/list' component={ListPage} exact />
          <Route path='/exp' component={ExpPage} exact />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
