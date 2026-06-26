import React from 'react'
import ManagerNavbar from '../../components/ManagerNavbar';
import { Outlet } from 'react-router-dom';

function ManagerLayout() {
  return (
    <>
      <ManagerNavbar />
      <main className='manager-main-content' style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet />
      </main>
    </>
  )
}

export default ManagerLayout
