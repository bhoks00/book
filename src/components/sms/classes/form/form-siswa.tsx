'use client'

import { FC, useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useDeleteData, useFetchData, useMutateData, usePatchData } from '@/hooks/useFetchData'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


// Zod schema
const bookSchema = z.object({
  fullName: z.string().min(1, 'Judul Siswa wajib diisi'),

})

interface Props {
       dataUpdate?:any,
       successCallback?:any,
       isDelete?:boolean
       classId:string
}



const FormSiswa: FC<Props> = ({dataUpdate,successCallback,classId,isDelete=false}) => {
  const {mutate,isError,isSuccess, isPending,error:errCreate} = useMutateData(dataUpdate?`/sms/students/${dataUpdate?.slug}`:'/sms/students','books-post')
  const {mutate:update,isError:isErrorUpdate,isSuccess:isSuccessUpdate, isPending:isPendingUpdate,error:errUpdate} = usePatchData(`/sms/students/${dataUpdate?.id}`,'students-update')
  const {mutate:deleteData,isError:isErrorDelete,isSuccess:isSuccessDelete, isPending:isPendingDelete,error:errDelete} = useDeleteData(`/sms/students/${dataUpdate?.id}`,'students-delete')

  const classRoom = useFetchData('/sms/class','sms-class')
  const formikRef = useRef(null)
  const initialValues = {
            fullName: dataUpdate?.fullName ??'',
          }

  useEffect(()=>{
    if (isSuccess){
      toast.success("suksess membuat Siswa")
      classRoom.refetch()

      successCallback&&successCallback()
    }
    else if(isSuccessDelete){
      toast.success("suksess meghapus Siswa")
      classRoom.refetch()

    }  
    else if(isSuccessUpdate){
      toast.success("suksess mengupdate Siswa")
      classRoom.refetch()
      successCallback&&successCallback()
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
      'fullName' :values.fullName,
      'classId':classId
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
          Apakah Kamu yakin? ingin Menghapus {dataUpdate?.fullName}?
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
                  <Label htmlFor="fullName">Nama Siswa</Label>
                  <Field as={Input} id="fullName" name="fullName" placeholder="Masukkan nama Siswa" />
                  <ErrorMessage name="fullName" component="div" className="text-sm text-red-500" />
                  <p className="text-sm text-gray-500">Contoh: "XII RPL"</p>
                </div>
                {classId}
               
                {dataUpdate?(
                  <Button type="submit" className="mt-4 cursor-pointer">Update Siswa</Button>

                ):(

                  <Button type="submit" className="mt-4 cursor-pointer">Buat Siswa</Button>

                )} 
              </Form>
            )}
          </Formik>
        
  )
}

export default FormSiswa
