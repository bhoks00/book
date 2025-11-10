'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useFetchData } from '@/hooks/useFetchData'
import { DeleteIcon, Edit2, Send, ChevronDown, Plus } from 'lucide-react'
import FormClass from './form/form-class'
import FormSiswa from './form/form-siswa'

const Siswa = ({ item, setDialog }) => {
  const [opensiswas, setOpensiswas] = useState(false)
  const [openTambahSiswa, setOpenTambahSiswa] = useState(false) // kontrol dialog lokal

  return (
    <div
      key={item.id}
      className='group transition-all bg-white/10 flex flex-col gap-2 font-bold px-8 py-3 rounded-2xl'
    >
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <h1 className='text-sm md:text-xl'>{item.name}</h1>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setOpensiswas(!opensiswas)}
          >
            <ChevronDown
              className={`transition-transform ${opensiswas ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>

        <motion.div className='flex transition-all gap-2 scale-0 group-hover:scale-100'>
          <Button
            size='icon'
            className='bg-amber-600 hover:bg-amber-500'
            onClick={() => setDialog({ type: 'edit-kelas', item })}
          >
            <Edit2 />
          </Button>

          <Button
            size='icon'
            className='bg-red-600 hover:bg-red-500'
            onClick={() => setDialog({ type: 'delete-kelas', item })}
          >
            <DeleteIcon />
          </Button>

          <Link href={`/dashboard/classes/attendance/${item.id}`}>
            <Button size='icon' className='bg-primary hover:bg-blue-500'>
              <Send />
            </Button>
          </Link>
        </motion.div>
      </div>

      {opensiswas && (
        <div className='ml-4 mt-2 flex flex-col gap-2'>
          {item.students?.length > 0 ? (
            item.students.map((siswa) => (
              <div
                key={siswa.slug}
                className='flex justify-between items-center bg-white/5 rounded-lg px-4 py-2 text-sm'
              >
                <span>{siswa.fullName}</span>
                <div className='flex gap-2'>
                  <Button
                    size='icon'
                    className='bg-red-600 hover:bg-red-500'
                    onClick={() => setDialog({ type: 'delete-siswa', item: siswa })}
                  >
                    <DeleteIcon className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className='text-xs italic text-gray-400 ml-2'>Belum ada siswa.</p>
          )}

          {/* Dialog Tambah Siswa dengan atribut open/onOpenChange */}
          <Dialog open={openTambahSiswa} onOpenChange={setOpenTambahSiswa}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='w-4 h-4' /> Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Tambah Siswa</DialogTitle>
              <FormSiswa
                classId={item.id}
                successCallback={() => setOpenTambahSiswa(false)} // menutup dialog
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

const DashboardClassPage = () => {
  const { data, refetch } = useFetchData('sms/class/', 'sms-class')
  const [dialog, setDialog] = useState({ type: null, item: null })
  const closeDialog = () => setDialog({ type: null, item: null })

  const [openTambahKelas, setOpenTambahKelas] = useState(false) // kontrol dialog tambah kelas

  return (
    <div className='flex flex-col gap-8 md:pt-20 text-white'>
      <h1 className='text-2xl md:text-3xl font-bold text-center'>
        Daftar Kelas
      </h1>

      {/* Tambah Kelas */}
      <div className='flex justify-center'>
        <Dialog open={openTambahKelas} onOpenChange={setOpenTambahKelas}>
          <DialogTrigger asChild>
            <Button className='w-fit'>
              <Plus className='size-8' /> Tambah Kelas Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormClass
              successCallback={() => {
                refetch()
                setOpenTambahKelas(false) // menutup dialog
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className='container mx-auto flex flex-col gap-4'>
        {data && data.map((item) => (
          <Siswa key={item.id} item={item} setDialog={setDialog} />
        ))}
      </div>

      {/* Dialog Global Edit/Delete */}
      <Dialog open={!!dialog.type} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          {dialog.type === 'edit-kelas' && (
            <>
              <DialogTitle>Edit Kelas</DialogTitle>
              <FormClass dataUpdate={dialog.item} successCallback={closeDialog} />
            </>
          )}

          {dialog.type === 'delete-kelas' && (
            <>
              <DialogTitle>Hapus Kelas</DialogTitle>
              <FormClass dataUpdate={dialog.item} isDelete successCallback={closeDialog} />
            </>
          )}

          {dialog.type === 'delete-siswa' && (
            <>
              <DialogTitle>Hapus Siswa</DialogTitle>
              <FormSiswa dataUpdate={dialog.item} isDelete successCallback={closeDialog} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardClassPage
