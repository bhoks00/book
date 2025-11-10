'use client'

import { useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFetchData } from '@/hooks/useFetchData'
import * as htmlToImage from 'html-to-image'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import jsPDF from 'jspdf'

export default function SessionViewPage() {
  const { session } = useParams()
  const { data, isLoading, isError } = useFetchData(`/sms/session/${session}`, `sms-session-${session}`)
  const printRef = useRef<HTMLDivElement>(null)

  const handleExportImage = async () => {
    if (!printRef.current) return
    try {
      const photo = await htmlToImage.toPng(printRef.current, {
        backgroundColor: '#ffffff',
        quality: 1,
        pixelRatio: 2,
      })
      
      const link = document.createElement('a')
      link.href =photo
      link.download = `absensi-${data?.name || 'session'}.png`
      link.click()
    } catch (error) {
      console.error('Gagal export gambar:', error)
    }
  }

  if (isLoading) return <p className="text-center text-gray-300 mt-10">Memuat data sesi...</p>
  if (isError || !data) return <p className="text-center text-red-500 mt-10">Gagal memuat data sesi</p>

  return (
    <div className='container mx-auto '>
    <Card className='bg-white' >
        <AspectRatio ref={printRef} className='p-8  text-black '  ratio={9/16}>
            <div  className="space-y-6">
                <header className="space-y-3">
                <h1 className="text-3xl font-bold">{data.name}</h1>
                <p className="">{data.description}</p>
                <div className="flex flex-wrap gap-4 text-sm  mt-2">
                    <span>📅 {new Date(data.date).toLocaleDateString('id-ID')}</span>
                    <span>🏫 {data.class}</span>
                </div>
                </header>

                {data.photo && (
                <img
                    src={data.photo}
                    alt="Class session"
                    className="w-full max-h-[400px] object-cover rounded-xl shadow-md"
                />
                )}
                
                <Table className='text-black'>
                        <TableHeader>
                        <TableRow className="text-black">
                            <TableHead className="w-16 text-center text-black">No</TableHead>
                            <TableHead className='text-black'>Nama Siswa</TableHead>
                            <TableHead className="text-center w-32 text-black">Status</TableHead>
                            <TableHead className='text-black'>Catatan</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {data.students.map((s: any, i: number) => (
                            <TableRow key={s.studentId} className=" hover:bg-white/5">
                            <TableCell className="text-center">{i + 1}</TableCell>
                            <TableCell>{s.fullName}</TableCell>
                            <TableCell className="text-center font-semibold">{s.status}</TableCell>
                            <TableCell>{s.notes || '-'}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                </Table>
            
            </div>
        </AspectRatio>

    </Card>
      <div className="flex justify-end">
        <Button onClick={handleExportImage} className="bg-blue-600 hover:bg-blue-500">
          Export PNG
        </Button>
      </div>

    </div>
  )
}
