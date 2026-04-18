import { Checkbox, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import type { Task } from '../types/task';

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const muted = '#9b9a97';
  const textColor = task.completed ? muted : '#37352f';

  return (
    <div
      className="task-row"
      style={{
        display: 'flex', alignItems: 'center',
        height: '100%', padding: '0 16px 0 12px',
        borderBottom: '1px solid #e9e9e7',
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        size="small"
        sx={{ flexShrink: 0, mr: 1 }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, lineHeight: '20px',
          color: textColor,
          textDecoration: task.completed ? 'line-through' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          transition: 'color 0.15s ease',
        }}>
          {task.title}
        </div>
        <div style={{
          display: 'flex', gap: 8, marginTop: 2,
          fontSize: 12, color: muted, lineHeight: '16px',
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
          {task.description && (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1 }}>
              {task.description}
            </span>
          )}
          {task.description && <span style={{ flexShrink: 0 }}>·</span>}
          <span style={{ flexShrink: 0 }}>
            {task.creation_date} · {task.creation_time}
          </span>
        </div>
      </div>

      <IconButton
        className="delete-btn"
        size="small"
        onClick={() => onDelete(task.id)}
        sx={{
          flexShrink: 0, ml: 0.5, color: muted,
          '&:hover': { color: '#e03e3e', backgroundColor: 'rgba(224,62,62,0.06)' },
        }}
      >
        <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </div>
  );
}
