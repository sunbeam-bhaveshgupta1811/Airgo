import React from 'react'
import AdminNavbar from './../../components/AdminNavbar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <AdminNavbar />
      <main style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
