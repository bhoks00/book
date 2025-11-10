"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useEffect, useRef, useState } from "react";
import { useMutateData } from "@/hooks/useFetchData";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

// Zod schema
const registerSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  fullName: z.string().min(1, "Full name wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const  RegisterForm = (successCallback?:any) => {
  const formikRef = useRef(null)

  const {mutate,isError,isSuccess,isPending,error:err} = useMutateData('/auth/register','auth-register')
  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        const body = {
            username: values.username,
            fullName: values.fullName,
            password: values.password
        }

        // mutate(body)
  };

  useEffect(()=>{
    if(isSuccess){
        toast.success("Berhasil Mendaftar let's Login!")
    }else if(isError){
        toast.error(err?.response?.data.message)
    }

  },[isError,isSuccess,isPending])

  return (
   <Formik
          innerRef={formikRef}
          initialValues={{ username: '', fullName: '', password: '' }}
          validationSchema={toFormikValidationSchema(registerSchema)}
          onSubmit={handleSubmit}
        >
          {({values}) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="username">Username</Label>
                <Field as={Input} id="username" name="username" placeholder="Masukkan username" />
                <ErrorMessage name="username" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Field as={Input} id="fullName" name="fullName" placeholder="Masukkan nama lengkap" />
                <ErrorMessage name="fullName" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <Field as={Input} type="password" id="password" name="password" placeholder="Masukkan password" />
                <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
              </div>

              <Button type="submit" className="mt-2" disabled={isPending || values?.fullName?.length == 0 || values?.password?.length == 0 || values?.username.length == 0}>
                {isPending ? 'Loading...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
  );
}
