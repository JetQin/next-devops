import React from 'react'

interface SuggestionPanelProps {
  suggestions: string
}

export default function SuggestionPanel({ suggestions }: SuggestionPanelProps) {
  return (
    <pre className="whitespace-pre-wrap">{suggestions}</pre>
  )
}