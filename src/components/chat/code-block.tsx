'use client';

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import React, { useState, memo } from "react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = memo(({ language, value }: { language: string, value: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.log(err);
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-md overflow-hidden group">
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-3 py-2 border-b border-gray-700">
        <span className="truncate max-w-[80%]">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="icon"
          className="p-1 h-6 w-6 sm:absolute sm:right-2 sm:top-1 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-200"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {isCopied ?
            <Check className="w-4 h-4 text-green-400" /> :
            <Copy className="w-4 h-4 text-gray-400" />
          }
        </Button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language?.toLowerCase() || 'text'}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'transparent',
          }}
          showLineNumbers={value.split('\n').length > 1}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';
export default CodeBlock;