"use client"

import * as React from "react"
import { 
  Bold, Italic, List, ListOrdered, Link2, AtSign, Quote, 
  Code as CodeIcon, Sigma, Undo, Redo, Heading1, Heading2, Heading3 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write something...", 
  className = "",
  minHeight = "200px"
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = React.useState<Record<string, boolean>>({})

  // Initialize the editor with proper content
  React.useEffect(() => {
    if (editorRef.current) {
      if (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>' || editorRef.current.innerHTML === '<p><br></p>') {
        editorRef.current.innerHTML = value || '';
      }
      
      // Apply placeholder behavior
      if (editorRef.current.innerHTML === '') {
        editorRef.current.dataset.placeholder = placeholder;
      }
    }

    // Setup mutation observer to update active formats when content changes
    if (editorRef.current) {
      const observer = new MutationObserver(() => {
        checkActiveFormats();
      });
      
      observer.observe(editorRef.current, { 
        attributes: true, 
        childList: true, 
        subtree: true,
        characterData: true
      });
      
      return () => observer.disconnect();
    }
  }, [value, placeholder]);

  // Check which formatting options are active at current selection
  const checkActiveFormats = React.useCallback(() => {
    const formats: Record<string, boolean> = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    };
    
    // Check for headings, blockquotes, links
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parentElement = selection.getRangeAt(0).commonAncestorContainer;
      let currentNode: Node | null = parentElement;
      
      // Traverse up the DOM tree to find formatting elements
      while (currentNode && currentNode.nodeType !== Node.DOCUMENT_NODE) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          const element = currentNode as Element;
          const tagName = element.tagName.toLowerCase();
          
          if (tagName === 'h1') formats.heading1 = true;
          if (tagName === 'h2') formats.heading2 = true;
          if (tagName === 'h3') formats.heading3 = true;
          if (tagName === 'blockquote') formats.quote = true;
          if (tagName === 'a') formats.link = true;
          if (tagName === 'code') formats.code = true;
          if (element.className === 'math-formula') formats.formula = true;
        }
        currentNode = currentNode.parentNode;
      }
    }
    
    setActiveFormats(formats);
  }, []);

  const handleSelectionChange = React.useCallback(() => {
    checkActiveFormats();
  }, [checkActiveFormats]);

  // Set up selection change event listener
  React.useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      
      // Handle placeholder visibility
      if (content === '' || content === '<br>' || content === '<p><br></p>') {
        editorRef.current.dataset.placeholder = placeholder;
      } else {
        delete editorRef.current.dataset.placeholder;
      }
      
      checkActiveFormats();
    }
  };

  // Focus editor and ensure selection is preserved
  const focusEditor = () => {
    if (editorRef.current) {
      if (!document.activeElement || document.activeElement !== editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const formatText = (command: string, value?: string) => {
    focusEditor();

    // Execute the command
    document.execCommand(command, false, value);
    
    // Update content and active formats
    handleContentChange();
    checkActiveFormats();
  };

  // Handle specific formatting cases
  const handleFormatting = (format: string) => {
    focusEditor();
    
    switch (format) {
      case 'bold':
        formatText('bold');
        break;
        
      case 'italic':
        formatText('italic');
        break;
        
      case 'unorderedList':
        formatText('insertUnorderedList');
        break;
        
      case 'orderedList':
        formatText('insertOrderedList');
        break;
        
      case 'link':
        const url = prompt('Enter link URL:');
        if (url) formatText('createLink', url);
        break;
        
      case 'mention':
        // Insert @ symbol at current cursor position
        formatText('insertText', '@');
        break;
        
      case 'quote':
        // Toggle blockquote
        if (activeFormats.quote) {
          formatText('formatBlock', '<div>');
        } else {
          formatText('formatBlock', '<blockquote>');
        }
        break;
        
      case 'code':
        // Wrap selection in <code> tag
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          if (!activeFormats.code) {
            const code = document.createElement('code');
            code.style.fontFamily = 'monospace';
            code.style.backgroundColor = '#f1f1f1';
            code.style.padding = '2px 4px';
            code.style.borderRadius = '3px';
            code.textContent = selection.toString();
            
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(code);
            
            // Move cursor after the inserted code
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStartAfter(code);
            newRange.setEndAfter(code);
            selection.addRange(newRange);
          } else {
            // Remove code formatting
            const range = selection.getRangeAt(0);
            const content = range.toString();
            range.deleteContents();
            const textNode = document.createTextNode(content);
            range.insertNode(textNode);
            
            // Position cursor after the inserted text
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStartAfter(textNode);
            newRange.setEndAfter(textNode);
            selection.addRange(newRange);
          }
          handleContentChange();
        }
        break;
        
      case 'formula':
        const formula = prompt('Enter mathematical formula:');
        if (formula) {
          const span = document.createElement('span');
          span.className = 'math-formula';
          span.style.fontStyle = 'italic';
          span.textContent = formula;
          
          document.execCommand('insertHTML', false, span.outerHTML);
          handleContentChange();
        }
        break;
        
      case 'undo':
        formatText('undo');
        break;
        
      case 'redo':
        formatText('redo');
        break;
        
      case 'heading1':
        if (activeFormats.heading1) {
          formatText('formatBlock', '<p>');
        } else {
          formatText('formatBlock', '<h1>');
        }
        break;
        
      case 'heading2':
        if (activeFormats.heading2) {
          formatText('formatBlock', '<p>');
        } else {
          formatText('formatBlock', '<h2>');
        }
        break;
        
      case 'heading3':
        if (activeFormats.heading3) {
          formatText('formatBlock', '<p>');
        } else {
          formatText('formatBlock', '<h3>');
        }
        break;
    }
  };
  
  // Handle editor click to update active formatting
  const handleEditorClick = () => {
    checkActiveFormats();
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Toolbar - styled to match your attached image */}
      <div className="flex flex-wrap items-center gap-1 rounded-md border bg-gray-50 p-2 mb-2">
        <Button 
          variant={activeFormats.bold ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.bold && "bg-gray-200"
          )}
          onClick={() => handleFormatting('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.italic ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.italic && "bg-gray-200"
          )}
          onClick={() => handleFormatting('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.unorderedList ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.unorderedList && "bg-gray-200"
          )}
          onClick={() => handleFormatting('unorderedList')}
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.orderedList ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.orderedList && "bg-gray-200"
          )}
          onClick={() => handleFormatting('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.link ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.link && "bg-gray-200"
          )}
          onClick={() => handleFormatting('link')}
          title="Add Link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormatting('mention')}
          title="Mention User"
        >
          <AtSign className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.quote ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.quote && "bg-gray-200"
          )}
          onClick={() => handleFormatting('quote')}
          title="Add Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.code ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.code && "bg-gray-200"
          )}
          onClick={() => handleFormatting('code')}
          title="Code Block"
        >
          <CodeIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.formula ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.formula && "bg-gray-200"
          )}
          onClick={() => handleFormatting('formula')}
          title="Formula/Math"
        >
          <Sigma className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormatting('undo')}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleFormatting('redo')}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.heading1 ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.heading1 && "bg-gray-200"
          )}
          onClick={() => handleFormatting('heading1')}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.heading2 ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.heading2 && "bg-gray-200"
          )}
          onClick={() => handleFormatting('heading2')}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.heading3 ? "default" : "ghost"}
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            activeFormats.heading3 && "bg-gray-200"
          )}
          onClick={() => handleFormatting('heading3')}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Rich text editor */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-y-auto bg-white text-left"
        style={{ 
          minHeight,
          direction: 'ltr',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onClick={handleEditorClick}
        onKeyUp={() => checkActiveFormats()}
        placeholder={placeholder}
        data-placeholder={placeholder}
      />

      <style jsx global>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
          pointer-events: none;
        }
        
        [contenteditable] {
          white-space: pre-wrap;
        }
        
        blockquote {
          border-left: 3px solid #cbd5e1;
          padding-left: 10px;
          margin: 10px 0;
          color: #475569;
        }
        
        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 16px 0 8px 0;
          line-height: 1.2;
        }
        
        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 14px 0 8px 0;
          line-height: 1.3;
        }
        
        h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 12px 0 8px 0;
          line-height: 1.4;
        }
        
        ul, ol {
          margin-left: 20px;
          padding-left: 10px;
        }
        
        a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}