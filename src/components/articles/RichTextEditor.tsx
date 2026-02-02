import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

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

  return (
    <div className="w-full">
      {/* Simple input-like editor */}
      <div 
        className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-slate-900 outline-none focus-within:border-primary transition-colors min-h-[200px]"
        onClick={() => editor?.view.focus()}
      >
        <EditorContent
          editor={editor}
          className="prose prose-base max-w-none dark:prose-invert outline-none [&>*]:m-1 [&_p]:text-base [&_h1]:text-2xl [&_h2]:text-xl [&_strong]:font-bold [&_em]:italic [&_u]:underline"
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <p className="text-xs text-muted-foreground mt-2">
        Tips: Cmd+B (bold) • Cmd+I (italic) • Cmd+Shift+X (strike) • Cmd+Alt+1 (H1) • Cmd+Alt+2 (H2)
      </p>

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
