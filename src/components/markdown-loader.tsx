"use client"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkEmoji from 'remark-emoji'
import CodeBlockWithCopy from "@/components/CodeBlock";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { Button } from "./ui/button";
import { axiosInstance } from "@/hooks/useFetchData";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  content:string
}


export const Markdown: React.FC<Props> = ({content}) => {
   

  return (
           <ReactMarkdown
          remarkPlugins={[remarkGfm,remarkEmoji]}
          rehypePlugins={[rehypeRaw,rehypeSlug]}
          components={{
            h1: (props) => <h1 className="text-3xl hover:text-primary font-bold mt-12 mb-4" {...props} />,
            h2: (props) => <h2 className="text-2xl hover:text-primary font-semibold mt-8 mb-3" {...props} />,
            h3: (props) => <h3 className="text-xl hover:text-primary font-semibold mt-6 mb-2" {...props} />,
            p: (props) => <p className="leading-relaxed mb-4" {...props} />,
            a: (props) => (
              <Link
                className="text-blue-600 dark:text-blue-400 underline hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            ul: (props) => <ul className="list-disc ml-6 mb-4" {...props} />,
            ol: (props) => <ol className="list-decimal ml-6 mb-4" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            blockquote: (props) => (
              <blockquote
                className="border-l-4 border-primary pl-4 italic my-4 font-mono"
                {...props}
              />
            ),
            code: (props) => {
              const languageSelect = (text:any)=>{
                const classNames = text?.node?.properties?.className
                if (classNames?.length == 0){
                  return "python"
                }else{
                  return text?.node?.properties?.className?.[0].split("-")[1]
                }
              }
              if (props.node?.position?.start.line == props.node?.position?.end.line){
               return (
                <span className="border border-foreground/25 py-1 px-4 rounded-sm font-mono text-sm font-bold">
                  {props.children}
                </span>
               ) 
              }else{
                return(
                <CodeBlockWithCopy
                  language={languageSelect(props)}
                  code={props.children}
                />
                  
              )
              }
            },
            pre: (props) => (
              <pre
                className=" porse text-white p-4 rounded-lg overflow-x-auto mb-4"
                {...props}
              />
            ),
            hr: () => <hr className="my-6 border-gray-300 dark:border-gray-700" />,
            img: (props) => (
              <img
                className="rounded-lg my-4 shadow-md mx-auto"
                alt={props.alt ?? ""}
                {...props}
              />
            ),
          }}
        >
                {content}
        </ReactMarkdown>
  )
}

export const MarkdownToDocx = ({content,disabled,filename}:{content:string,disabled:boolean,filename?:string})=>{
  const handleToDocx = async ()=>{
    try {
      const response = await axiosInstance.post('/converters/md2docx',
        {markdown:content},
        {responseType:"blob"}
      )
      console.log(response.data)
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob)
      




      // for download
      const a = document.createElement("a")
      a.href = url;
      a.download = filename?`${filename}.docx`:"document.docx";
      a.click()
    } catch (err) {
      console.error("Gagal convert ke PDF:", err);
    }
      
  }
  return(
    <Button disabled={disabled} onClick={()=>handleToDocx()} >
        Docx
    </Button>
  )
}

export const MarkdownCopy = ({content,disabled}:{content:string,disabled:boolean})=>{
  const [isCopied,setIscopied] = useState(false)

  useEffect(()=>{
    if (isCopied){
      setTimeout(()=>{
        setIscopied(false)
      },1000)
    }
  },[isCopied])
  
  const handleCopy = async ()=>{
    try {
     await navigator.clipboard.writeText(content)
     setIscopied(true)
    } catch (err) {
      console.error("Gagal Copy File", err);
    }
      
  }
  return(
    <Button 
      disabled={disabled}
      className={cn(
         isCopied? 'font-bold': '',
         "transition-all"
      )}
      variant={isCopied?'outline':'default'}
      onClick={()=>handleCopy()} >
        {isCopied?'Copied!':'Copy'}
    </Button>
  )
}

export const MarkdownToFile = ({content,disabled,filename}:{content:string,disabled:boolean,filename?:string})=>{
  const handleCopy = async ()=>{
    try {
      const blob = new Blob([content],{type:"text/markdown"});
      const url  = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename?`${filename}.md`:'filemarkdown.md';
      
      a.click();
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Gagal convert ke PDF:", err);
    }
      
  }
  return(
    <Button disabled ={disabled} onClick={()=>handleCopy()} >
        MD
    </Button>
  )
}
