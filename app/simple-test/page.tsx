'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Direct Supabase client
const supabase = createClient(
  'https://ptyodzlexndntparjaet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eW9kemxleG5kbnRwYXJqYWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODM0NDQsImV4cCI6MjA3MDY1OTQ0NH0.Igvnydr6wwy2CqCeVQIDheV2jlQ-SlRSVQJKigdFd8I'
)

export default function SimplerTestPage() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null)
  
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runConnectionTest = async () => {
    setLoading(true)
    try {
      // Test the connection by making a simple query
      const { data, error } = await supabase
        .from('posts')
        .select('count', { count: 'exact', head: true })
      
      if (error) {
        setTestResult({
          success: false,
          message: `Error connecting to Supabase: ${error.message}`
        })
        return
      }
      
      setTestResult({
        success: true,
        message: 'Successfully connected to Supabase!'
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error testing connection: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        setTestResult({
          success: false,
          message: `Error loading posts: ${error.message}`
        })
        return
      }
      
      if (data) {
        setPosts(data)
        setTestResult({
          success: true,
          message: `Successfully loaded ${data.length} posts from Supabase!`
        })
      } else {
        setTestResult({
          success: false,
          message: 'No posts found in the database.'
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error loading posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Simple Supabase Test</h1>
      
      <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Test your Supabase connection with direct client initialization.
            </p>
            <Button 
              onClick={runConnectionTest} 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Load Posts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Load posts from your Supabase database.
            </p>
            <Button 
              onClick={loadPosts} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Loading...' : 'Load Posts'}
            </Button>
          </CardContent>
        </Card>

        {testResult && (
          <Alert variant={testResult.success ? 'default' : 'destructive'}>
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{testResult.success ? 'Success!' : 'Error'}</AlertTitle>
            <AlertDescription>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}

        {posts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Posts ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="p-4 border rounded-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                      <img 
                        src={post.user_image.startsWith('/') ? post.user_image : `/${post.user_image}`} 
                        alt={post.user_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-user.jpg';
                        }}
                      />
                    </div>
                    <span className="font-medium">{post.user_name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Created: {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
