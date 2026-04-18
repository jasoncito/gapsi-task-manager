import { useRef, useState } from 'react';

interface Props {
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function TaskForm({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setError('');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
    if (e.key === 'Escape') handleCancel();
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
          color: '#9b9a97', padding: '4px 0',
          display: 'flex', alignItems: 'center', gap: 5,
          transition: 'color 0.12s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#37352f')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9b9a97')}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New task
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(15,15,15,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
    >
      <div
        style={{
          backgroundColor: '#fff', borderRadius: 8, width: '100%', maxWidth: 480,
          border: '1px solid #e9e9e7',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        }}
        onKeyDown={handleKeyDown}
      >
        <div style={{ padding: '20px 20px 0' }}>
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            placeholder="Task name"
            style={{
              width: '100%', border: 'none', outline: 'none',
              fontSize: 15, fontWeight: 500, fontFamily: 'inherit',
              color: '#37352f', background: 'transparent',
              lineHeight: 1.5,
            }}
          />
          {error && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#e03e3e' }}>{error}</p>
          )}
        </div>

        <div style={{ padding: '8px 20px 0' }}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            style={{
              width: '100%', border: 'none', outline: 'none', resize: 'none',
              fontSize: 13, fontFamily: 'inherit', color: '#37352f',
              background: 'transparent', lineHeight: 1.6,
            }}
          />
        </div>

        <div style={{ height: 1, backgroundColor: '#e9e9e7', margin: '12px 0 0' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '10px 16px' }}>
          <button
            onClick={handleCancel}
            style={{
              background: 'none', border: '1px solid #e9e9e7', borderRadius: 5,
              padding: '5px 12px', fontSize: 13, fontFamily: 'inherit',
              color: '#37352f', cursor: 'pointer', fontWeight: 500,
              transition: 'background-color 0.1s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#e9e9e7' : '#37352f',
              border: 'none', borderRadius: 5,
              padding: '5px 12px', fontSize: 13, fontFamily: 'inherit',
              color: loading ? '#9b9a97' : '#fff', cursor: loading ? 'default' : 'pointer',
              fontWeight: 500, transition: 'background-color 0.1s ease',
            }}
          >
            {loading ? 'Adding…' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  );
}
