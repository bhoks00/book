'use client'

import { FC, useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useDeleteData, useFetchData, useMutateData, usePatchData } from '@/hooks/useFetchData'
import { toast } from 'sonner'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Editor } from '../editor'
import { useRouter } from 'next/navigation'
import { Toaster, ToasterProvider } from '@gravity-ui/uikit'

// ✅ Schema validasi
const chapterSchema = z.object({
  bookId: z.string().min(1, 'Buku wajib dipilih'),
  order: z.number().min(1, 'Order minimal 1'),
  title: z.string().min(1, 'Judul wajib diisi'),
})

const FormChapter: FC = ({ dataUpdate, successCallback, isDelete = false }) => {
  const router = useRouter()
  const { data: books, refetch } = useFetchData('/books', 'books')
  const { mutate, isSuccess, isError, isPending,error } = useMutateData('/chapters', 'chapters-post')
  const { mutate: update, isSuccess: isSuccessUpdate, isError: isErrorUpdate, isPending: isPendingUpdate,error:errorUpdate } =
  usePatchData(`/chapters/${dataUpdate?.slug}`, 'chapters-update')
  const { mutate: deleteData, isSuccess: isSuccessDelete, isError: isErrorDelete, isPending: isPendingDelete, error:errorDelete} =
  useDeleteData(`/chapters/${dataUpdate?.slug}`, 'chapters-delete')

  const formikRef = useRef<any>(null)
  const [content, setContent] = useState(dataUpdate?.content ?? '')

  const initialValues = {
    bookId: dataUpdate?.bookId ?? '',
    order: dataUpdate?.order ?? 1,
    title: dataUpdate?.title ?? '',
  }

  // ✅ Toast handler
  useEffect(() => {
    if (isSuccess) {
      toast.success('Chapter berhasil ditambahkan')
      refetch()
      formikRef.current?.resetForm()
      router.push('/dashboard/books')
      successCallback?.()
    } else if (isSuccessUpdate) {
      toast.success('Chapter berhasil diperbarui')
      refetch()
      successCallback?.()
      router.push('/dashboard/books')
    } else if (isSuccessDelete) {
      toast.success('Chapter berhasil dihapus')
      refetch()
      successCallback?.()
      router.push('/dashboard/books')
    } else if (isError || isErrorUpdate || isErrorDelete) {
      toast.error(error?.response?.data?.message || 
        errorDelete?.response?.data?.message||
        errorUpdate?.response?.data?.message
      )
    }
  }, [isError,isSuccess,isPending,isErrorUpdate,isPendingUpdate,isSuccessUpdate,isErrorDelete,isSuccessDelete,isPendingDelete])

  // 🚀 Handler submit
  const handleSubmit = (values: typeof initialValues) => {
    const body = { ...values, content }

    if (dataUpdate) {
      update(body)
    } else {
      mutate(body)
    }
  }

  // 🚮 Handler delete
  const handleDelete = () => {
    deleteData(`/chapters/${dataUpdate?.slug}`)
    refetch()
    successCallback?.()
  }

  // 🗑️ Mode delete
  if (isDelete) {
    return (
      <div className="flex flex-col gap-8">
        <h4>Apakah kamu yakin ingin menghapus chapter <b>{dataUpdate?.title}</b>?</h4>
        <div className="flex gap-2">
          <Button className="bg-red-600 hover:bg-red-500" onClick={handleDelete}>
            Konfirmasi
          </Button>
          <Button variant="ghost" onClick={() => successCallback?.()}>
            Batal
          </Button>
        </div>
      </div>
    )
  }

  // 📝 Form input
  return (
    <ToasterProvider toaster={new Toaster}>
      <main className="w-full flex gap-4 flex-col md:flex-row mx-auto p-6">
        <div className="flex-3">
          <Editor onChange={setContent} value={content} />
        </div>

        <Card className="shadow-lg sticky top-4 self-start w-full flex-1 max-h-fit">
          <CardHeader>
            <CardTitle className="text-2xl">Meta Data</CardTitle>
          </CardHeader>

          <CardContent>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={toFormikValidationSchema(chapterSchema)}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* 📚 Buku */}
                  <div className="flex flex-col gap-2">
                    <Label>Buku</Label>
                    <Select
                      onValueChange={(value) => setFieldValue('bookId', value)}
                      value={values.bookId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih buku" />
                      </SelectTrigger>
                      <SelectContent>
                        {books?.map((book: any) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="bookId" component="div" className="text-sm text-red-500" />
                  </div>

                  {/* 🔢 Urutan */}
                  <div className="flex flex-col gap-2">
                    <Label>Urutan Chapter</Label>
                    <Field as={Input} id="order" name="order" type="number" min="1" />
                    <ErrorMessage name="order" component="div" className="text-sm text-red-500" />
                  </div>

                  {/* 📝 Judul */}
                  <div className="flex flex-col gap-2">
                    <Label>Judul Chapter</Label>
                    <Field as={Input} id="title" name="title" placeholder="Masukkan judul chapter" />
                    <ErrorMessage name="title" component="div" className="text-sm text-red-500" />
                  </div>

                  {/* 💾 Tombol Simpan */}
                  <Button
                    type="submit"
                    className="mt-4 cursor-pointer"
                    disabled={
                      isPending ||
                      isPendingUpdate ||
                      content.length === 0 ||
                      values.title.length === 0 ||
                      values.bookId.length === 0
                    }
                  >
                    {dataUpdate
                      ? isPendingUpdate
                        ? 'Menyimpan...'
                        : 'Update Chapter'
                      : isPending
                      ? 'Menyimpan...'
                      : 'Simpan Chapter'}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </main>

    </ToasterProvider>
  )
}

export default FormChapter
