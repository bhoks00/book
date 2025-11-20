"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useEffect, useRef } from "react";
import { useMutateData } from "@/hooks/useFetchData";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Zod schema
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const LoginForm = ({ successCallback }: { successCallback?: () => void }) => {
  const formikRef = useRef(null);
  const router = useRouter();


  const handleSubmit = async (values: any) => {
    // login(values.username, values.password);
  };

  
  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ username: "", password: "" }}
      validationSchema={toFormikValidationSchema(loginSchema)}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Username</Label>
            <Field as={Input} id="username" name="username" placeholder="Masukkan username" />
            <ErrorMessage name="username" component="div" className="text-sm text-red-500" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Field as={Input} type="password" id="password" name="password" placeholder="Masukkan password" />
            <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
          </div>

          <Button
            type="submit"
            className="mt-2"
          >
          Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};
