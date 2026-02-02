import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import UnderlineExtension from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  ImagePlus,
  Undo2,
  Redo2,
  Code,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your article...',
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: true,
      }),
      UnderlineExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageDialogOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
      setIsImageDialogOpen(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full border border-border rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/20">
        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo2 size={14} />
        </button>

        <div className="w-px h-5 bg-border/30 mx-0.5" />

        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Bold (Cmd+B)"
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Italic (Cmd+I)"
        >
          <Italic size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('underline') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Underline"
        >
          <Underline size={14} />
        </button>

        <div className="w-px h-5 bg-border/30 mx-0.5" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded transition-colors text-xs font-bold ${
            editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition-colors text-xs font-bold ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <div className="w-px h-5 bg-border/30 mx-0.5" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <div className="w-px h-5 bg-border/30 mx-0.5" />

        {/* Code block */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('codeBlock') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          title="Code Block"
        >
          <Code size={14} />
        </button>

        {/* Image */}
        <button
          onClick={() => setIsImageDialogOpen(true)}
          className="p-1.5 hover:bg-muted rounded transition-colors"
          title="Insert Image"
        >
          <ImagePlus size={14} />
        </button>
      </div>

      {/* Editor content area */}
      <div 
        className="prose prose-base max-w-none dark:prose-invert px-4 py-3 outline-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_p]:text-base [&_p]:my-2 [&_h1]:text-3xl [&_h1]:my-3 [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:my-2 [&_h2]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1 [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded [&_code]:font-mono [&_code]:text-sm"
        onClick={() => editor?.view.focus()}
        style={{ minHeight: '250px' }}
      >
        <EditorContent
          editor={editor}
          className="outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none"
        />
      </div>

      {/* Image Dialog */}
      {isImageDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-background border-2 border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold">Add Image</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold mb-2 block">Upload from device</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or paste URL</span>
                </div>
              </div>

              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addImage}
                disabled={!imageUrl}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
              >
                Add Image
              </button>
              <button
                onClick={() => {
                  setIsImageDialogOpen(false);
                  setImageUrl('');
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
