'use client';
import React, { useEffect } from 'react';
import { useMarkdownEditor, MarkdownEditorView } from '@gravity-ui/markdown-editor';

export function Editor({
  onChange,
  value = '',
}: {
  onChange: (value: string) => void;
  value?: string;
}) {
  const editor = useMarkdownEditor({ allowHTML: false });

  // Sinkronisasi konten awal (value dari parent)
  useEffect(() => {
    if (editor && value !== editor.getValue()) {
      editor.append(value || '');
    }
  }, [editor, value]);

  // Update ke parent ketika ada perubahan
  useEffect(() => {
    const handleUpdate = () => {
      const currentValue = editor.getValue();
      onChange(currentValue);
    };

    editor.on('change', handleUpdate);
    return () => editor.off('change', handleUpdate);
  }, [editor, onChange]);

  return (
    <MarkdownEditorView
      className="border rounded-lg bg-white text-black shadow-sm p-4 min-h-screen"
      stickyToolbar
      autofocus
      editor={editor}
    />
  );
}
