import React from 'react'
import ManagerNavbar from '../../components/ManagerNavbar';
import { Outlet } from 'react-router-dom';

function ManagerLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <ManagerNavbar />
      <main style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default ManagerLayout
