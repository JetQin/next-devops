import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeEditorProps {
  code: string
  readOnly?: boolean
}

export default function CodeEditor({ code, readOnly = false }: CodeEditorProps) {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={vscDarkPlus}
      customStyle={{ background: 'transparent' }}
      wrapLines={true}
      showLineNumbers={true}
    >
      {code}
    </SyntaxHighlighter>
  )
}