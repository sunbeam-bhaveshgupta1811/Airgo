import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { verifyEmailApi } from '../../services/auth/user'


function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('verifying') 
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('failed')
      setMessage('No verification token found. Please check your email link.')
      return
    }

    verifyEmailApi(token).then((res) => {
      if (res && res.success) {
        setStatus('success')
        setMessage(res.message || 'Email verified successfully!')
        setTimeout(() => navigate('/login?verified=true'), 2000)
      } else {
        setStatus('failed')
        setMessage(res?.message || 'Verification failed. The link may have expired.')
      }
    })
  }, [token, navigate])

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {status === 'verifying' && (
          <>
            <div style={styles.spinner} />
            <h3 style={styles.title}>Verifying your account...</h3>
            <p style={styles.sub}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ ...styles.icon, color: '#27ae60' }}>✓</div>
            <h3 style={styles.title}>Email Verified!</h3>
            <p style={styles.sub}>{message}</p>
            <p style={styles.sub}>Redirecting to login...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{ ...styles.icon, color: '#e74c3c' }}>✗</div>
            <h3 style={styles.title}>Verification Failed</h3>
            <p style={styles.sub}>{message}</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/login" style={styles.btn}>Go to Login</Link>
              <Link to="/resend-verification" style={{ ...styles.btn, background: '#f39c12' }}>
                Resend Email
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f6f9'
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '3rem 2.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    maxWidth: '420px',
    width: '90%'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#2c3e50'
  },
  sub: {
    color: '#666',
    fontSize: '0.95rem'
  },
  icon: {
    fontSize: '3.5rem',
    fontWeight: 700,
    marginBottom: '1rem'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    margin: '0 auto 1.5rem',
    animation: 'spin 0.8s linear infinite'
  },
  btn: {
    padding: '0.6rem 1.4rem',
    background: '#3498db',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500
  }
}

export default VerifyEmailPage
