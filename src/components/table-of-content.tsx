'use client'

import { FC } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface ToCItem {
  id: string
  title: string
}

interface TableOfContentProps {
  items: ToCItem[]
}

const TableOfContent: FC<TableOfContentProps> = ({ items }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <Card className="p-4 sticky top-24">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Isi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {items.map(item => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="block text-blue-600 hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </CardContent>
      </Card>
    </motion.aside>
  )
}

export default TableOfContent
