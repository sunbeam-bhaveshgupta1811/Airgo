import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPasswordApi } from '../../services/auth/user'
import { toast } from 'react-toastify'
import '../../css/ResetPassword.css'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [tokenMissing, setTokenMissing] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setTokenMissing(true)
    }
  }, [token])

  const onResetPassword = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.warn('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const res = await resetPasswordApi(token, password, confirmPassword)

      if (res && res.success) {
        toast.success('Password reset successful!')
        navigate('/login')
      } else {
        toast.error(res?.message || 'Reset link is invalid or expired')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenMissing) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="card-header">
            <div className="password-icon">
              <i className="fas fa-exclamation-triangle" style={{ color: '#e74c3c' }}></i>
            </div>
            <h3>Invalid Reset Link</h3>
            <p>This password reset link is invalid or has expired.</p>
          </div>
          <div className="card-body">
            <Link to="/forgot-password" className="btn btn-warning w-100 text-center d-block">
              Request a new reset link
            </Link>
            <div className="back-to-login" style={{ marginTop: '1rem' }}>
              <Link to="/login" className="login-link">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">

        <div className="card-header">
          <div className="password-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h3>Reset Your Password</h3>
          <p>Enter your new password below</p>
        </div>

        <div className="card-body">
          <form onSubmit={onResetPassword}>

            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="New password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength="8"
              />
              <span
                className="input-icon clickable"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>

            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength="8"
              />
              <span className="input-icon">
                <i className="fas fa-lock"></i>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fas fa-key me-2"></i>
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className="back-to-login">
            <span>Remember your password? </span>
            <Link to="/login" className="login-link">Login here</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ResetPasswordPage
