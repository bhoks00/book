'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import jsPDF from 'jspdf'

interface Chapter {
  title: string
  content: string
}

export default function BookPdfGenerator() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentContent, setCurrentContent] = useState('')

  const addChapter = () => {
    if (!currentTitle || !currentContent) return
    setChapters([...chapters, { title: currentTitle, content: currentContent }])
    setCurrentTitle('')
    setCurrentContent('')
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    let y = 20

    // Cover
    doc.setFontSize(24)
    doc.text('Buku Saya', 20, y)
    y += 20
    doc.setFontSize(16)
    doc.text(`Jumlah Chapter: ${chapters.length}`, 20, y)
    y += 20
    doc.addPage()
    y = 20

    // Daftar Isi
    doc.setFontSize(18)
    doc.text('Daftar Isi', 20, y)
    y += 10
    chapters.forEach((ch, i) => {
      doc.setFontSize(14)
      doc.text(`${i + 1}. ${ch.title}`, 20, y)
      y += 10
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })

    doc.addPage()
    y = 20

    // Isi Chapter
    chapters.forEach((ch, i) => {
      doc.setFontSize(18)
      doc.text(`${i + 1}. ${ch.title}`, 20, y)
      y += 10
      doc.setFontSize(12)

      // Split content ke beberapa baris agar muat
      const lines = doc.splitTextToSize(ch.content, 170)
      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage()
          y = 20
        }
        doc.text(line, 20, y)
        y += 7
      })
      y += 10
    })

    doc.save('Buku.pdf')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Form Chapter */}
      <div className="space-y-2">
        <Input
          placeholder="Judul Chapter"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
        />
        <Textarea
          placeholder="Tulis Markdown Chapter..."
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          className="h-40"
        />
        <Button onClick={addChapter}>Tambah Chapter</Button>
      </div>

      {/* Preview Chapters */}
      {chapters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Preview Chapters</h2>
          {chapters.map((ch, i) => (
            <div key={i} className="border p-4 rounded">
              <h3 className="font-semibold">{i + 1}. {ch.title}</h3>
              <ReactMarkdown>{ch.content}</ReactMarkdown>
            </div>
          ))}
        </div>
      )}

      {/* Generate PDF */}
      {chapters.length > 0 && (
        <Button onClick={generatePDF} className="mt-4">
          Download PDF
        </Button>
      )}
    </div>
  )
}
