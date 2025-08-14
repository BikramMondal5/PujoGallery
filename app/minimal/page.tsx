'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Direct client without any context dependencies
const supabaseClient = createClient(
  'https://ptyodzlexndntparjaet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eW9kemxleG5kbnRwYXJqYWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODM0NDQsImV4cCI6MjA3MDY1OTQ0NH0.Igvnydr6wwy2CqCeVQIDheV2jlQ-SlRSVQJKigdFd8I'
)

export default function MinimalTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testConnection = async () => {
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*')
        .limit(1)
      
      if (error) {
        setError(`Connection error: ${error.message}`)
      } else {
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Minimal Supabase Test</h1>
      
      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {error && (
        <div style={{
          padding: '15px',
          marginTop: '20px',
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          borderRadius: '4px'
        }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div style={{
          padding: '15px',
          marginTop: '20px',
          backgroundColor: '#e8f5e9',
          border: '1px solid #c8e6c9',
          borderRadius: '4px'
        }}>
          <h3>Success!</h3>
          <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
