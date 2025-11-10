'use client'

import { FC } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {motion} from 'motion/react'
import { AspectRatio } from './ui/aspect-ratio'

interface Chapter {
  id: number
  title: string
  url: string
}

interface ChapterListProps {
  data: Chapter[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const ChapterList: FC<ChapterListProps> = ({ data }) => {
  return (
    <motion.div
      className="grid grid-cols-1  md:grid-cols-2 gap-6   "
      initial= {cardVariants.hidden}
      animate={cardVariants.visible}
      transition={{
        type:"tween"
      }}
      >
      {data?.chapters?.map((chapter,index) => (
        <motion.div className='hover:scale-110 transition-all ' key={chapter.id} >
          <Link href={`${data.slug}/${chapter?.slug}`}>
            <Card className="hover:shadow-lg relative  transition p-0 ">
        
              <CardContent className='p-0 w-full grid grid-cols-12 '>
                <div 
                 
                className='w-12 h-12  cols-span-1 rounded-full overflow-hidden'>
                  <AspectRatio ratio={1/1} className=' bg-primary flex items-center justify-center'>
                    {index+1}
                  </AspectRatio>

                </div>
               
                <div
                className=' col-span-11 flex justify-center items-center nh-red'>
                 {chapter.title}
                </div>
    
              </CardContent>

            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ChapterList
