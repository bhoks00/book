'use client'

import { FC } from 'react'
import Image from 'next/image'
import {motion} from 'motion/react'
import {Table, TableBody, TableCell, TableRow } from './ui/table'
import { AspectRatio } from './ui/aspect-ratio'
import { TextGenerateEffect } from './ui/text-generate-effect'
import { Book } from '@/type'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'

interface BookHeroProps {
  title: string
  description: string
  image: string
}

const BookHero = ({data}:{data:Book}) => {
  return (
    <motion.div
      className="bg-primary overflow-hidden text-white p-12 rounded-b-3xl bg-linear-to-b relative from-background to-primary"
      initial={{ opacity: 0, y: -500 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type:"tween",
        duration: 0.4
      }}
    >
    <div className=" mx-auto grid grid-cols-3 gap-4 ">
          <motion.div
            initial = {{x:-500}}
            animate = {{
              x:0
            }}
            transition={{
                type: "spring",
                damping: 10,
                stiffness: 100
            }}
          >
            <AspectRatio ratio={4/5} className='group'>
              <Image className="object-cover shadow-background col-span-1 rounded-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all" alt="Book Cover " src={data?.cover} fill></Image>
            </AspectRatio>
          </motion.div>
          <div className='bg-linear-to-l from-transparent via-white/60 bottom-0 h-px w-full absolute'></div>
          <div className="px-4 col-span-2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-4xl font-extrabold  ">
              {data?.title }
            </h1>
            <div>         
              <ScrollArea className='whitespace-nowrap'>

              <Table>
                <TableBody>
                  <TableRow  >
                    <TableCell className="w-28">Penulis</TableCell>
                    <TableCell className='capitalize'>{data.author}</TableCell>
                  </TableRow>
                   <TableRow  >
                    <TableCell className="w-28">Untuk</TableCell>
                    <TableCell>{data.level}</TableCell>
                  </TableRow>
                   <TableRow  >
                    <TableCell className="w-28">Chapters</TableCell>
                    <TableCell>{data.chapters.length}</TableCell>
                  </TableRow>
                   <TableRow  >
                    <TableCell className="w-28">Tags</TableCell>
                    <TableCell className='flex gap-4'>
                       {data?.tags.map((item,index)=>{
                        return(
                          <Badge key={index} className='bg-secondary'>
                            {item}
                          </Badge>
                        )
                       })}
                    </TableCell>
                  </TableRow>
                  
                   <TableRow  >
                    <TableCell className="w-28">Penulis</TableCell>
                    <TableCell>{data.author}</TableCell>
                  </TableRow>
                  
                
                  <TableRow>
                    <TableCell>Created at</TableCell>
                    <TableCell>{
                       new Date(data?.createdAt).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      
                      }
                      
                      </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </ScrollArea>

            </div>
            <div className="col-span-3 hidden md:block">
              {data?.description}
            </div>
          </div>
          <div className="col-span-3 md:hidden">
            {data?.description}

          </div>
    </div>
    </motion.div>
  )
}

export default BookHero
