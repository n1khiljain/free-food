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
import { title } from "process";

const checkForm = z.object({
    title: z.string().min(1, "Title is required").max(300, 'Title must be less than 300 characters'),
    body: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
    location: z.string().optional(),
})

type checkFormData = z.infer<typeof checkForm>

interface Post {
    id: string
    created_at: string
    updated_at: string
    title: string
    body: string | null
    location: string | null
    category: string | null
    upvotes: number | null
    downvotes: number | null
    image_url: string | null
    status: string | null
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
            category: item.category,
            upvotes: item.upvotes,
            downvotes: item.downvotes,
            image_url: item.image_url,
            status: item.status,
        }))
        setPosts(formattedData)
      }

    const submitData = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await supabase.from('posts')
            .insert({ 
                title,
                body,
                location,
                category,
                upvotes: 0,
                downvotes: 0,
                status: 'active'}).select()

        if (error) {
            console.error('Error inserting data:', error)
        } else {
            console.log('Data inserted successfully:', data)
            
            setTitle('')
            setBody('')
            setLocation('')
            setCategory('Free Food')

            fetchData()
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
                
                <div className="space-y-4">
                    <div className="flex gap-4">
                    <InputGroup>
                        <InputGroupInput 
                            className="w-full h-14 text-base" 
                            placeholder="Title"
                        />
                        <InputGroupAddon>
                            {}
                        </InputGroupAddon>
                        </InputGroup>

                        <Select>
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
                    />
                    <InputGroupAddon>
                        {}
                    </InputGroupAddon>
                    </InputGroup>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Post</Button>
                    </div>
                </div>
                </div>
            </div>
            </div>
    )
}

export default Create