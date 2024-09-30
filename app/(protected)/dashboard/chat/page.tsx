'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { Message, useChat } from 'ai/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchParams } from 'next/navigation'
import { SendIcon, CopyIcon, CheckIcon } from 'lucide-react'
import React from 'react'
import { number } from 'zod';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export const maxDuration = 30;


export default function V0Clone() {
    const searchParams = useSearchParams()

    const [code, setCode] = useState('// Type your code here')
    const editorRef = useRef<any>(null)

    const { messages, input, handleSubmit, handleInputChange, isLoading } = useChat();


    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor
    }

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value)
        }
    }

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            toast.success('Copied to clipboard!')
        }).catch((err) => {
            toast.error('Failed to copy: ' + err)
        })
    }

    const applyResponse = (content: string) => {
        setCode(content);
    }
    useEffect(() => {
        const alert_number = searchParams.get('alert_number');
        const owner = searchParams.get('owner');
        const repo = searchParams.get('repo');
        fetch('/api/repos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ owner: owner, repo: repo, number: alert_number }),
          })
          .then((res) => res.json())
          .then((alert) => {
            setCode(JSON.stringify(alert));
          })
        
    }, [])

    const UserMessage = (message: Message) => {
        return (
            <div key={message.id} className="flex px-2 py-4 sm:px-4">
                <img className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"  src="https://dummyimage.com/256x256/363536/ffffff&text=U" />

                <div className="flex max-w-3xl items-center">
                    <p>{message.content}</p>
                </div>
            </div>
        )
    }

    const SystemMessage = (message: Message)  => {
        return (
            <>
                <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 w-6"
                        >
                        <CopyIcon className="h-4 w-4" />
                        <span className="sr-only">Copy to clipboard</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => applyResponse(message.content)}
                        className="h-6 w-6"
                        >
                        <CheckIcon className="h-4 w-4" />
                        <span className="sr-only">Apply response</span>
                    </Button>
                </div>
                <div id={message.id} className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
                    <img className="mr-2 flex h-8 w-8 rounded-full sm:mr-4" src="https://dummyimage.com/256x256/354ea1/ffffff&text=G" />

                    <div className="flex max-w-3xl items-center rounded-xl">
                    <p>
                        {message.content}
                    </p>
                    </div>
                </div>
            </>
        )
    }


    return (
        <div className="flex h-5/6 bg-gray-100 font-sans  bottom-2.5">
            <div className="w-1/2 bg-gray-900">
                <MonacoEditor
                height="100%"
                language="yaml"
                theme="vs-light"
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false
                }}
                />
            </div>
            
            {/* Chat Panel and Chatbox */}
            <div className="w-1/2 flex flex-col">
                <div className="flex flex-col h-screen bg-background bottom-2.5">
                    <ScrollArea className="flex-grow p-4">
                        {messages.map(message => {
                            if(message.role == "user"){
                                return UserMessage(message)
                            }else{
                                return SystemMessage(message)
                            }
                        })}
                       
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                placeholder="Type your message..."
                                className="flex-grow"
                                />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                <SendIcon className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}