import React from 'react'
import BaseLogin from '../../../components/auth/BaseLogin'
import { login } from '../../../services/auth/user'

function Login() {
  return (
    <BaseLogin
      loginType="admin"
      authService={login}
      redirectPath="/admin/dashboard"
    />
  )
}

export default Login
