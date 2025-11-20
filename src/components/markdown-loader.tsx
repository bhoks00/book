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
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollView } from "@/hooks/useScrollView";
import FadeInOnScroll from "./FadeInScroll";

type Props = {
  content:string
}


export const Markdown: React.FC<Props> = ({content}) => {
    const { ref, visible } = useScrollView();


  return (
    <div ref={ref}>

<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkEmoji]}
  rehypePlugins={[rehypeRaw, rehypeSlug]}
  components={{
    //
    // HEADINGS (ID TETAP DI ELEMEN TERLUAR)
    //
    h1: (props) => {
      const { id, children, ...rest } = props;
      return (
        <h1
          id={id}
          className="text-3xl hover:text-primary font-bold mt-12 mb-4"
          {...rest}
        >
          <FadeInOnScroll>
            <span>{children}</span>
          </FadeInOnScroll>
        </h1>
      );
    },

    h2: (props) => {
      const { id, children, ...rest } = props;
      return (
        <h2
          id={id}
          className="text-2xl hover:text-primary font-semibold mt-8 mb-3"
          {...rest}
        >
          <FadeInOnScroll>
            <span>{children}</span>
          </FadeInOnScroll>
        </h2>
      );
    },

    h3: (props) => {
      const { id, children, ...rest } = props;
      return (
        <h3
          id={id}
          className="text-xl hover:text-primary font-semibold mt-6 mb-2"
          {...rest}
        >
          <FadeInOnScroll>
            <span>{children}</span>
          </FadeInOnScroll>
        </h3>
      );
    },

    //
    // PARAGRAPH
    //
    p: ({ children, ...rest }) => (
      <p className="leading-relaxed mb-4" {...rest}>
        <FadeInOnScroll>{children}</FadeInOnScroll>
      </p>
    ),

    //
    // LINK
    //
    a: ({ children, ...rest }) => (
      <FadeInOnScroll>
        <Link
          className="text-blue-600 dark:text-blue-400 underline hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </Link>
      </FadeInOnScroll>
    ),

    //
    // LISTS
    //
    ul: ({ children, ...rest }) => (
      <ul className="list-disc ml-6 mb-4" {...rest}>
        <FadeInOnScroll>{children}</FadeInOnScroll>
      </ul>
    ),

    ol: ({ children, ...rest }) => (
      <ol className="list-decimal ml-6 mb-4" {...rest}>
        <FadeInOnScroll>{children}</FadeInOnScroll>
      </ol>
    ),

    li: ({ children, ...rest }) => (
      <li className="mb-1" {...rest}>
        <FadeInOnScroll>{children}</FadeInOnScroll>
      </li>
    ),

    //
    // BLOCKQUOTE
    //
    blockquote: ({ children, ...rest }) => (
      <blockquote
        className="border-l-4 border-primary pl-4 italic my-4 font-mono"
        {...rest}
      >
        <FadeInOnScroll>{children}</FadeInOnScroll>
      </blockquote>
    ),

    //
    // INLINE CODE & CODE BLOCKS
    //
    code: (props) => {
      const languageSelect = (text) => {
        const classNames = text?.node?.properties?.className;
        if (!classNames || classNames.length === 0) return "plaintext";
        return classNames[0].split("-")[1];
      };

      // Inline code
      if (props.node?.position?.start.line === props.node?.position?.end.line) {
        return (
          <FadeInOnScroll>
            <span className="border border-foreground/25 py-1 px-4 rounded-sm font-mono text-sm font-bold">
              {props.children}
            </span>
          </FadeInOnScroll>
        );
      }

      // Code block
      return (
        <FadeInOnScroll>
          <CodeBlockWithCopy
            language={languageSelect(props)}
            code={props.children}
          />
        </FadeInOnScroll>
      );
    },

    pre: ({ children, ...rest }) => (
      <pre
        className="porse text-white p-4 rounded-lg overflow-x-auto mb-4"
        {...rest}
      >
        <FadeInOnScroll>{children}</FadeInOnScroll>
      </pre>
    ),

    //
    // HR
    //
    hr: () => (
      <FadeInOnScroll>
        <hr className="my-6 border-gray-300 dark:border-gray-700" />
      </FadeInOnScroll>
    ),

    //
    // IMAGES
    //
    img: ({ alt, ...rest }) => (
      <FadeInOnScroll>
        <img
          className="rounded-lg my-4 shadow-md mx-auto"
          alt={alt ?? ""}
          {...rest}
        />
      </FadeInOnScroll>
    ),
  }}
>
  {content}
</ReactMarkdown>


    </div>
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
