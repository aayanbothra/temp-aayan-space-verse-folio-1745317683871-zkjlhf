
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Code
} from 'lucide-react';

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState<{ start: number; end: number; text: string } | null>(null);

  const handleSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = value.substring(start, end);
      setSelectedText({ start, end, text });
    }
  };

  const insertAtCursor = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleBold = () => insertAtCursor('**', '**');
  const handleItalic = () => insertAtCursor('*', '*');
  const handleLink = () => {
    const url = prompt('Enter URL:') || '#';
    insertAtCursor(`[`, `](${url})`);
  };
  const handleImage = () => {
    const url = prompt('Enter image URL:') || '';
    if (url) {
      insertAtCursor(`![Image](${url})\n`);
    }
  };
  const handleH1 = () => insertAtCursor('# ');
  const handleH2 = () => insertAtCursor('## ');
  const handleH3 = () => insertAtCursor('### ');
  const handleBulletList = () => insertAtCursor('- ');
  const handleNumberedList = () => insertAtCursor('1. ');
  const handleQuote = () => insertAtCursor('> ');
  const handleCode = () => insertAtCursor('```\n', '\n```');

  const convertToHTML = (markdown: string): string => {
    // This is a very simple markdown to HTML converter
    // In a production app, you would use a proper library like marked.js
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Convert images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');
    
    // Convert lists
    html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>');
    
    // Wrap lists
    html = html.replace(/<li>.*?<\/li>/g, (match) => {
      if (match.startsWith('<li>1.')) {
        return '<ol>' + match + '</ol>';
      }
      return '<ul>' + match + '</ul>';
    });
    
    // Convert blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Convert code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert paragraphs
    html = html.replace(/^(?!<[oh])(?!<li)(?!<blockquote)(.+)$/gm, '<p>$1</p>');
    
    // Add line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  // Listen for changes and update the converted HTML
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-t-md bg-muted">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleBold}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleItalic}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleLink}
          title="Link"
        >
          <Link size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleImage}
          title="Image"
        >
          <ImageIcon size={16} />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleH1}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleH2}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleH3}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </Button>
        <span className="w-px h-6 bg-border mx-1"></span>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleBulletList}
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleNumberedList}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleQuote}
          title="Quote"
        >
          <Quote size={16} />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleCode}
          title="Code Block"
        >
          <Code size={16} />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelection}
        className="min-h-[300px] font-mono text-sm"
        placeholder="Write your blog post content here... Use markdown formatting or the toolbar above."
      />
      <div className="text-xs text-muted-foreground">
        You can use markdown syntax or the formatting toolbar.
      </div>
    </div>
  );
};

export default BlogEditor;
