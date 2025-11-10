"use client"
import { Markdown, MarkdownCopy, MarkdownToDocx, MarkdownToFile } from '@/components/markdown-loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutateData } from '@/hooks/useFetchData'
import  { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IconBrandGithubCopilot } from '@tabler/icons-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
const AI = () => {
    const [prompt,setPropmt]=useState("")
    const {mutate,data,isPending} = useMutateData('/ai/materi','materi')

    const handleInsert = (text:string) =>{
    const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

        if (el?.tagName ==="INPUT" || el?.tagName ==="TEXTAREA"){
            const start = el.selectionStart
            const end = el.selectionEnd
            el.value = el.value.slice(0,start) +  text + el.value.slice(end)
            el.selectionStart = el.selectionEnd = start + text.length;
            el.focus();
            
        }
    }
    
    useEffect(() => {
        if (data?.text) {
            setTimeout(() => handleInsert(data.text), 0);
        }
    }, [data]);

    const handleSend = ()=>{
        const body = {
            prompt:prompt
        }
        mutate(body)
    }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button   className='fixed bottom-4 right-4'>
            <IconBrandGithubCopilot className='size-8'/>
        </Button>
      </SheetTrigger>
      <SheetContent className='grid gap-2  grid-rows-8 '>
        <SheetHeader className='row-span-1 '>
          <SheetTitle>Try AI</SheetTitle>
        </SheetHeader>
        <div className={cn(' m-0',
            data?"row-span-5":'row-span-6')}
        >
            <ScrollArea className=" p-2 h-full w-full  rounded-md border">
                <Markdown content = {data?.text ??(isPending?"Generating..":"Let's Generate Text")}/>

            </ScrollArea>

        </div>
        <SheetFooter className={cn(' m-0 row-span-1',
            data?"row-span-2":'row-span-1'
        )}>
            {data && (
                <div className='flex gap-2 justify-start'>
                    <MarkdownToDocx filename={prompt} disabled={!data?.text} content={data?.text}/>
                    <MarkdownCopy disabled={!data?.text} content={data?.text}></MarkdownCopy>
                    <MarkdownToFile filename={prompt}  disabled={!data?.text} content={data?.text}></MarkdownToFile>
                </div>

            )}
            <Input onChange={(e)=>setPropmt(e.target.value)} value={prompt} />
            <Button disabled={isPending} type='submit' onClick={()=>handleSend()} >
                {isPending?"Generating":"Generate"}
            </Button>
          
        </SheetFooter>
      </SheetContent>
    </Sheet>


  )
}

export default AI