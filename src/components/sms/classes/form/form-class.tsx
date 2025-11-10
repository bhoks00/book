'use client'

import { FC, useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useDeleteData, useFetchData, useMutateData, usePatchData } from '@/hooks/useFetchData'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


// Zod schema
const bookSchema = z.object({
  name: z.string().min(1, 'Judul Kelas wajib diisi'),

})

interface Props {
       dataUpdate?:any,
       successCallback?:any,
       isDelete?:boolean
}



const FormClass: FC<Props> = ({dataUpdate,successCallback,isDelete=false}) => {
  const {mutate,isError,isSuccess, isPending,error:errCreate} = useMutateData(dataUpdate?`/sms/class/${dataUpdate?.slug}`:'/sms/class','books-post')
  const {mutate:update,isError:isErrorUpdate,isSuccess:isSuccessUpdate, isPending:isPendingUpdate,error:errUpdate} = usePatchData(`/sms/class/${dataUpdate?.id}`,'class-update')
  const {mutate:deleteData,isError:isErrorDelete,isSuccess:isSuccessDelete, isPending:isPendingDelete,error:errDelete} = useDeleteData(`/sms/class/${dataUpdate?.id}`,'class-delete')

  const classRoom = useFetchData('/sms/class','sms-class')
  const router = useRouter()
  const formikRef = useRef(null)
  const initialValues = {
            name: dataUpdate?.name ??'',
          }

  useEffect(()=>{
    if (isSuccess){
      toast.success("suksess membuat Kelas")
      router.push('/dashboard/classes')
      successCallback&&successCallback()
    }
    else if(isSuccessDelete){
      toast.success("suksess meghapus Kelas")
      classRoom.refetch()
      successCallback&&successCallback()

      router.push('/dashboard/classes')
    }  
    else if(isSuccessUpdate){
      toast.success("suksess mengupdate Kelas")
      classRoom.refetch()
      successCallback&&successCallback()
      router.push('/dashboard/classes')
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
    deleteData()
    
  }
 
  const handleSubmit = (values) => {
    const body = {
      'name' :values.name,
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
          <pre><code>{JSON.stringify(dataUpdate?.id)}</code></pre>

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
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="name">Nama Kelas</Label>
                  <Field as={Input} id="name" name="name" placeholder="Masukkan nama kelas" />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                  <p className="text-sm text-gray-500">Contoh: "XII RPL"</p>
                </div>

               
                {dataUpdate?(
                  <Button type="submit" className="mt-4 cursor-pointer">Update Kelas</Button>

                ):(

                  <Button type="submit" className="mt-4 cursor-pointer">Buat Kelas</Button>

                )} 
              </Form>
            )}
          </Formik>
        
  )
}

export default FormClass
