"use client"

import React, { useState } from "react"
import { useFormik } from "formik"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ImageUploader() {
  const [preview, setPreview] = useState<string | null>(null)

  // 🔹 TanStack Mutation untuk upload
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("image", file)
      const res = await axios.post(`${process.env.API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return res.data
    },
  })

  // 🔹 Formik
  const formik = useFormik({
    initialValues: { image: null },
    onSubmit: async (values) => {
      if (!values.image) return
      uploadMutation.mutate(values.image)
    },
  })

  return (
    <Card className="max-w-md mx-auto p-4">
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="image">Upload Gambar</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  formik.setFieldValue("image", file)
                  setPreview(URL.createObjectURL(file))
                }
              }}
            />
          </div>

          {preview && (
            <div className="w-full flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl shadow"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>

          {uploadMutation.isSuccess && (
            <div className="text-green-600 text-center">
              ✅ Upload sukses:{" "}
              <a
                href={uploadMutation.data.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Lihat gambar
              </a>
            </div>
          )}

          {uploadMutation.isError && (
            <div className="text-red-600 text-center">
              ❌ Gagal upload: {(uploadMutation.error as any).message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
