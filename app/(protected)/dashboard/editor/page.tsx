"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon, CopyIcon, CheckIcon } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import dynamic from 'next/dynamic';
import { boolean } from 'zod';

interface CodeEditorProps {
    code: string;
    readOnly?: boolean;
}

  
const MonacoEditor = dynamic(
    () => import('@monaco-editor/react'),
    { ssr: false }
);


export default function CodeEditorChatPage() {
  const { toast } = useToast()
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: "Hello! I'm your coding assistant. How can I help you today?" }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [codeContent, setCodeContent] = useState(`import os
os.system('ping -n %4' %p)
`)


  const copilotSuggestions = `import os
cmd = 'ping -n 4 %s' %shlex.quote(ip)
flag = subprocess.run(cmd, shell=False, 
                      stdout=subprocess.PIPE)
stdout = flag.stdout
`

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: inputMessage }])
      // Here you would typically send the message to a backend or AI service
      // For this example, we'll just echo the message back as the assistant
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'assistant', content: `You said: ${inputMessage}` }])
      }, 500)
      setInputMessage('')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copilotSuggestions)
      toast({
        title: "Copied to clipboard",
        description: "The suggestions have been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "There was an error copying to the clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleApply = () => {
    setCodeContent(prevCode => prevCode + '\n\n' + copilotSuggestions)
    toast({
      title: "Code applied",
      description: "The suggestions have been added to your code.",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fix Suggestions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <MonacoEditor
                height="100%"
                defaultLanguage="typescript"
                value={codeContent}
                options={{
                    readOnly: false,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                }}
                />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow mb-4 w-full rounded-md border p-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Suggestions:</h3>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={handleCopy}>
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleApply}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                </div>
              </div>
              <pre className="font-mono text-sm bg-muted p-2 rounded">
                {copilotSuggestions}
              </pre>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button type="submit" size="icon" onClick={handleSendMessage}>
                <SendIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}