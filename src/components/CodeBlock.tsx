"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlockWithCopy({ code, language = "javascript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-300 font-medium">
        <span className="capitalize tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
            copied ? "text-green-400" : "hover:text-white text-gray-300"
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          background: "transparent",
          margin: 0,
          padding: "1rem",
          fontSize: "0.9rem",
          lineHeight: "1.6",
        }}
      >
        {code?.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
