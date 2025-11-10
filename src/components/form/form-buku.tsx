'use client'

import { FC, useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useDeleteData, useFetchData, useMutateData, usePatchData } from '@/hooks/useFetchData'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'


// Zod schema
const bookSchema = z.object({
  name: z.string().min(1, 'Judul buku wajib diisi'),
  descriptions: z.string().min(1, 'Deskripsi wajib diisi'),
  image: z.string().min(1, 'URL gambar wajib diisi'),
})


const FormBook: FC = ({dataUpdate,successCallback,isDelete=false}) => {
  const {mutate,isError,isSuccess, isPending,error:errCreate} = useMutateData(dataUpdate?`/books/${dataUpdate?.slug}`:'/books','books-post')
  const {mutate:update,isError:isErrorUpdate,isSuccess:isSuccessUpdate, isPending:isPendingUpdate,error:errUpdate} = usePatchData(`/books/${dataUpdate?.slug}`,'books-update')
  const {mutate:deleteData,isError:isErrorDelete,isSuccess:isSuccessDelete, isPending:isPendingDelete,error:errDelete} = useDeleteData(`/books/${dataUpdate?.slug}`,'books-delete')

  const dataRoot = useFetchData('/','root')
  const dataBook = useFetchData('/books','books')
  const router = useRouter()
  const formikRef = useRef(null)
  const initialValues = {
            name: dataUpdate?.name ??'',
            descriptions: dataUpdate?.descriptions??'',
            image: dataUpdate?.image??'',
          }

  useEffect(()=>{
    if (isSuccess){
      toast.success("suksess membuat buku")
      dataRoot.refetch()
      router.push('/dashboard/books')
      successCallback&&successCallback()
    }
    else if(isSuccessDelete){
      toast.success("suksess meghapus Buku")
      dataBook.refetch()
      successCallback&&successCallback()

      router.push('/dashboard/books')
    }  
    else if(isSuccessUpdate){
      toast.success("suksess mengupdate buku")
      dataBook.refetch()
      successCallback&&successCallback()
      router.push('/dashboard/books')
    }    
    else if (isError){
      toast.error(errCreate.response?.data?.message)
      console.log(errCreate)
    }else if (isErrorUpdate ){
      toast.error(errUpdate.response?.data?.message)

    }
    else if (isErrorDelete ){
      toast.error(errDelete.response?.data?.message)

    }
  },[isError,isSuccess,isPending,isErrorUpdate,isPendingUpdate,isSuccessUpdate,isErrorDelete,isSuccessDelete,isPendingDelete])
  
  const handleDelete = (values) => {

    deleteData(`books/${dataUpdate.slug}`)
    
  }
 
  const handleSubmit = (values) => {
    const body = {
      'name' :values.name,
      'descriptions':values.descriptions,
      'image':values.image
    }
    if (dataUpdate){
      update(body)
    } else{
      mutate(body)
    }
    
  }
  if (isDelete){
    return(
      <div className='flex flex-col gap-8'>
        <h4>
          Apakah Kamu yakin? ingin Menghapus {dataUpdate?.name}?
        </h4>
        <div className='flex flex-col gap-2'>
          <Button className='bg-red-600 hover:bg-red-500' onClick={handleDelete}>Konfirmasi</Button>
          <Button variant={"ghost"} onClick={()=>successCallback()} >Batal</Button>
        </div>
      </div>
    )
  }
  return (
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(bookSchema)}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-8">
                {/* Judul Buku */}
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="name">Judul Buku</Label>
                  <Field as={Input} id="name" name="name" placeholder="Masukkan judul buku" />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                  <p className="text-sm text-gray-500">Contoh: "Belajar React & Next.js"</p>
                </div>

                {/* Deskripsi */}
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="descriptions">Deskripsi Buku</Label>
                  <Field
                    as={Textarea}
                    id="descriptions"
                    name="descriptions"
                    placeholder="Deskripsi singkat buku"
                  />
                  <ErrorMessage
                    name="descriptions"
                    component="div"
                    className="text-sm text-red-500"
                  />
                  <p className="text-sm text-gray-500">Contoh: "Panduan lengkap belajar React & Next.js"</p>
                </div>

                {/* URL Gambar */}
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="image">URL Gambar Buku</Label>
                  <Field as={Input} id="image" name="image" placeholder="https://contoh.com/cover.jpg" />
                  <ErrorMessage name="image" component="div" className="text-sm text-red-500" />
                  <p className="text-sm text-gray-500">URL gambar cover buku</p>
                </div>

                {dataUpdate?(
                  <Button type="submit" className="mt-4 cursor-pointer">Update Buku</Button>

                ):(

                  <Button type="submit" className="mt-4 cursor-pointer">Buat Buku</Button>

                )} 
              </Form>
            )}
          </Formik>
        
  )
}

export default FormBook
