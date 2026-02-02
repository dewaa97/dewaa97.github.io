import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

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

  const ButtonGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-1 border-r border-border pr-1 mr-1">{children}</div>
  );

  const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    isActive = false,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    onClick: () => void;
    isActive?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'p-2 rounded transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-foreground hover:bg-muted/70'
      )}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="flex flex-col h-full space-y-2 bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-muted rounded-lg border border-border">
        <ButtonGroup>
          <ToolButton
            icon={Bold}
            label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
          <ToolButton
            icon={Italic}
            label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
          <ToolButton
            icon={UnderlineIcon}
            label="Underline"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          />
        </ButtonGroup>

        <ButtonGroup>
          <ToolButton
            icon={Heading1}
            label="Heading 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          />
          <ToolButton
            icon={Heading2}
            label="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          />
        </ButtonGroup>

        <ButtonGroup>
          <ToolButton
            icon={List}
            label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          />
          <ToolButton
            icon={ListOrdered}
            label="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          />
        </ButtonGroup>

        <ButtonGroup>
          <ToolButton
            icon={ImageIcon}
            label="Insert Image"
            onClick={() => setIsImageDialogOpen(true)}
          />
        </ButtonGroup>

        <ButtonGroup>
          <ToolButton
            icon={Undo2}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolButton
            icon={Redo2}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          />
        </ButtonGroup>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden border border-border rounded-lg bg-white dark:bg-slate-900">
        <EditorContent
          editor={editor}
          className="h-full overflow-y-auto prose prose-sm max-w-none px-4 py-3 focus:outline-none dark:prose-invert"
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
