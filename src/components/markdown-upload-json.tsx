'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function MarkdownUploadJson() {
  const [fileContent, setFileContent] = useState('')
  const [title, setTitle] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setFileContent(text)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    const payload = {
      title,
      content: fileContent,
      fileName,
      createdAt: new Date().toISOString(),
    }

    try {
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Gagal kirim ke server')
      alert('Markdown berhasil dikirim sebagai JSON')
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat mengirim')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Markdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Judul Chapter"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input type="file" accept=".md" onChange={handleFileChange} />
          {fileName && <p className="text-sm text-gray-500">File: {fileName}</p>}

          <Textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            placeholder="Atau tulis Markdown di sini..."
            className="h-64"
          />

          <Button onClick={handleSubmit}>Kirim ke Server</Button>
        </CardContent>
      </Card>
    </main>
  )
}
