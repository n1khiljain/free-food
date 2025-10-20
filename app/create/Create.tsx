"use client"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
  } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { z } from 'zod';

import { supabase }  from '@/app/page';

const checkForm = z.object({
    title: z.string().min(1, "Title is required").max(300, 'Title must be less than 300 characters'),
    body: z.string().max(5000, 'Description must be less than 5000 characters').optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
})

type checkFormData = z.infer<typeof checkForm>

interface Post {
    id: string
    created_at: string
    updated_at: string
    title: string
    body: string | null
    location: string | null
  }

export function Create() {
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string}>({})


    const fetchData = async () => {
        const { data, error } = await supabase.from('posts').select().order('created_at', {ascending: false})
        console.log(data)
        const formattedData = (data || []).map(item => ({
            id: item.id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            title: item.title,
            body: item.body,
            location: item.location,
        }))
        setPosts(formattedData)
      }

    const submitData = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (!supabase) {
                throw new Error('Supabase client not initialized. Check your environment variables.');
            }


            // Debug environment variables
            console.log('Environment check:');
            console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
            console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_KEY ? 'Set' : 'Not set');

            const validatedData = checkForm.parse({
                title,
                body: body || '',
                location: location || ''
            });

            console.log('Attempting to insert data:', validatedData);

            const { data, error } = await supabase.from('posts').insert(validatedData).select()

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Data inserted successfully:', data)

            alert('Post created successfully')

            setTitle('')
            setBody('')
            setLocation('')

            router.push('/')
        } catch (error) {
            console.error('Full error details:', error);
            if (error instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {}
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message
                    }
                })
                setErrors(fieldErrors)
                console.log('Validation errors:', fieldErrors)
                alert(`Validation errors: ${Object.values(fieldErrors).join(', ')}`)
            } else {
                console.log('Error inserting data:', error)
                console.log('Error type:', typeof error)
                console.log('Error constructor:', error?.constructor?.name)
                
                // Handle different types of errors
                if (error && typeof error === 'object') {
                    if ('message' in error) {
                        alert(`Error creating post: ${error.message}`)
                    } else if ('error' in error) {
                        alert(`Error creating post: ${error.error}`)
                    } else if ('details' in error) {
                        alert(`Error creating post: ${error.details}`)
                    } else {
                        alert(`Error creating post: ${JSON.stringify(error)}`)
                    }
                } else {
                    alert(`Error creating post: ${String(error)}`)
                }
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="flex justify-center w-full max-h-screen mt-14 py-12">
            <div className="w-full max-w-5xl px-8">
                <div className="bg-white rounded-lg border border-gray-300 p-8 shadow-sm">
                <h1 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
                    Create a post
                </h1>
                <form onSubmit={submitData}>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                        <InputGroup>
                            <InputGroupInput 
                                className="w-full h-14 text-base" 
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            </InputGroup>

                            <Select value={location} onValueChange={setLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Location (Optional)"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Location</SelectLabel>
                                        <SelectItem value="sproul">Sproul</SelectItem>
                                        <SelectItem value="memorial glade">Memorial Glade</SelectItem>
                                        <SelectItem value="rsf">RSF</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectGroup>
                                    
                                </SelectContent>
                            </Select>
                        </div>

                        <InputGroup>
                        <InputGroupTextarea 
                            className="w-full min-h-[200px] text-base resize-none" 
                            placeholder="Text (optional)"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        </InputGroup>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button 
                            variant="outline"
                            type="button"
                            onClick={() => router.push('/')}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading || !title}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </Button>
                        </div>
                    </div>
                </form>
                
                </div>
            </div>
            </div>
    )
}

export default Create