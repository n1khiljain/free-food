"use client"

import * as React from "react";
import Image from "next/image";
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, MapPinIcon, CalendarIcon } from "lucide-react"
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from "react";

// UI Components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/Navbar";

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!)

interface Post {
  id: string
  created_at: string
  updated_at: string
  title: string
  body: string | null
  location: string | null
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching posts:', error)
        return
      }
      
      setPosts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
          <Navbar />
          
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Recent Posts</h1>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <CircleHelpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No posts yet. Be the first to create one!</p>
                <Link href="/create" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="w-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 ml-4">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                      
                      {post.location && (
                        <div className="flex items-center text-sm text-blue-600 mt-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="capitalize">{post.location}</span>
                        </div>
                      )}
                    </CardHeader>
                    
                    {post.body && (
                      <CardContent className="pt-0">
                        <CardDescription className="text-gray-700 leading-relaxed">
                          {post.body}
                        </CardDescription>
                      </CardContent>
                    )}
                    
                    <CardFooter className="pt-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Posted {formatDate(post.created_at)}</span>
                        {post.updated_at !== post.created_at && (
                          <span>• Updated {formatDate(post.updated_at)}</span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
      </main>
    </div>
  );
}
