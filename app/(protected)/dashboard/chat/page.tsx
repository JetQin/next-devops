'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'react-hot-toast'
import { useChat } from 'ai/react';
import React from 'react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export const maxDuration = 30;


export default function V0Clone() {
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


    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Code Editor */}
            <div className="w-1/2 bg-gray-900">
                <MonacoEditor
                height="100%"
                language="javascript"
                theme="vs-dark"
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
                <div>
                    {messages.map(message => (
                        <div key={message.id}>
                        <div>{message.role}</div>
                        <div>{message.content}</div>
                        </div>
                    ))}

                    <form onSubmit={handleSubmit}>
                        <input
                        value={input}
                        placeholder="Send a message..."
                        onChange={handleInputChange}
                        disabled={isLoading}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}