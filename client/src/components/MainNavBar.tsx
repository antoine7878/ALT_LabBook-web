import React from 'react'
import { NavLink } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const MAIN_NAV_LINKS = [
  {
    title: 'Board',
    route: '/',
  },
  {
    title: 'List',
    route: '/list',
  },
  {
    title: 'Exps',
    route: '/exp',
  },
]

function MainNavBar() {
  return (
    <Navbar className='mainNavBarjs' bg='dark' variant='dark'>
      <Nav>
        {MAIN_NAV_LINKS.map((item) => (
          <NavLink
            to={item.route}
            key={item.route}
            className='mainNavBarjs--navLink'
            draggable={false}
          >
            {item.title}
          </NavLink>
        ))}
      </Nav>
      <Navbar.Brand className='mainNavBarjs--navBrand'>ALT-Book</Navbar.Brand>
    </Navbar>
  )
}
export default MainNavBar
