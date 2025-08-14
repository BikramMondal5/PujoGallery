'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testSupabaseConnection } from '@/src/supabase-test'
import { fetchPosts } from '@/src/supabase-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function TestPage() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null)
  
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runConnectionTest = async () => {
    setLoading(true)
    try {
      const result = await testSupabaseConnection()
      setTestResult({
        success: result,
        message: result 
          ? 'Successfully connected to Supabase and tested the posts table!' 
          : 'Failed to connect to Supabase. Please check your credentials and console for errors.'
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
      const postsData = await fetchPosts()
      if (postsData) {
        setPosts(postsData)
        setTestResult({
          success: true,
          message: `Successfully loaded ${postsData.length} posts from Supabase!`
        })
      } else {
        setTestResult({
          success: false,
          message: 'Failed to load posts or no posts found.'
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
      <h1 className="text-3xl font-bold mb-8 text-center">Supabase Integration Test</h1>
      
      <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Test your Supabase connection and posts table by creating and deleting a test post.
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
              Load posts from your Supabase database to check if everything is working.
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
