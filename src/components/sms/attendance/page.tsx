'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Formik, Form, Field } from 'formik'
import axios from 'axios'
import { useFetchData, useMutateData } from '@/hooks/useFetchData'

// Ambil daftar siswa di kelas
const fetchStudents = async (classId) => {
  const res = await axios.get(`/api/classRooms/${classId}`)
  return res.data.students
}

// Submit sesi baru
const createSession = async (data) => {
  const res = await axios.post('/api/attendanceSessions', data)
  return res.data
}

// Submit batch absensi
const submitBatchAttendance = async ({ sessionId, attendances }) => {
  const res = await axios.post('/api/attendanceSessions/attendance/batch', { sessionId, attendances })
  return res.data
}

export default function AttendancePage() {
  const { classId } = useParams()

  const [sessionId, setSessionId] = useState(null)
  const [attendances, setAttendances] = useState([])

  // Fetch sisw
  const { data: classData, isLoading } = useFetchData(`sms/class/${classId}`,`clases-${classId}`)

  // Mutation create session
  const sessionMutation = useMutateData('sms/session/','class-session')

  // Mutation batch attendance
  const batchMutation = useMutateData('sms/session/attendance/','class-session')


  if (isLoading) return <p>Loading siswa...</p>
 const handleCreateSession = (values, { setSubmitting }) => {
    sessionMutation.mutate(
      { ...values, classId },
      {
        onSuccess: (data) => {
          setSessionId(data.id)
          // init attendances siswa
          const initialAttendances = classData.students?.map((s) => ({
            studentId: s.id,
            status: 'A',
            note: ''
          }))
          setAttendances(initialAttendances)
          setSubmitting(false)
        },
        onError: () => setSubmitting(false)
      }
    )
  }

  /** ===============================
   * Handle submit batch absensi
   * =============================== */
  const handleBatchAttendance = (values, { setSubmitting }) => {
    batchMutation.mutate(
      { sessionId, attendances: values.attendances },
      {
        onSuccess: () => {
          alert('Absensi berhasil disimpan')
          setSessionId(null)
          setAttendances([])
          queryClient.invalidateQueries([`clases-${classId}`])
          setSubmitting(false)
        },
        onError: () => setSubmitting(false)
      }
    )
  }
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Absensi Kelas</h1>
      {/* Dialog Buat Sesi */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Mulai Absensi</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Buat Sesi Absensi</DialogTitle>
          <Formik
            initialValues={{ name: '', description: '', date: '', startTime: '', endTime: '' }}
            onSubmit={handleCreateSession}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-3">
                <Field name="name" as={Input} placeholder="Nama Sesi" required />
                <Field name="description" as={Input} placeholder="Deskripsi" />
                <Field name="date" type="date" as={Input} required />
                <Field name="startTime" type="time" as={Input} required />
                <Field name="endTime" type="time" as={Input} required />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Membuat...' : 'Buat Sesi'}
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Jika sesi sudah dibuat, tampilkan daftar siswa */}
      {sessionId && (
        <div className="mt-6">
          <h2 className="text-xl mb-4">Isi Absensi Siswa</h2>
          <Formik
            initialValues={{ attendances }}
            enableReinitialize
            onSubmit={(values) => {
              batchMutation.mutate({ sessionId, attendances: values.attendances })
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex flex-col gap-4">
                {classData.students?.map((s, index) => (
                  <div key={s.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                    <span className="w-1/3">{s.fullName}</span>
                    <Select
                      value={values.attendances[index].status}
                      onValueChange={(val) => setFieldValue(`attendances.${index}.status`, val)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="H">Hadir</SelectItem>
                        <SelectItem value="I">Izin</SelectItem>
                        <SelectItem value="P">Pulang</SelectItem>
                        <SelectItem value="A">Absen</SelectItem>
                        <SelectItem value="S">Sakit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Field
                      name={`attendances.${index}.note`}
                      as={Input}
                      placeholder="Catatan"
                      className="flex-1"
                    />
                  </div>
                ))}
                <Button type="submit" className="mt-4">
                  {batchMutation.isLoading ? 'Menyimpan...' : 'Simpan Absensi'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  )
}
