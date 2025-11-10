'use client'

import { FC } from 'react'
import { motion } from 'framer-motion'

interface ChapterContentProps {
  title: string
  content: string
}

const ChapterContent: FC<ChapterContentProps> = ({ title, content }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="prose prose-lg max-w-none"
    >
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </motion.article>
  )
}

export default ChapterContent
