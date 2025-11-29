import { useState, useEffect } from 'react';

export default function AutoSaveDemo() {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (text === '') return;

    const timeoutId = setTimeout(() => {
      setIsSaving(true);
      fetch('/api/save', { method: 'POST', body: JSON.stringify({ text }) })
        .then(() => setIsSaving(false));
    }, 2000); 

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      {isSaving && <span>Saving...</span>}
    </div>
  );
}