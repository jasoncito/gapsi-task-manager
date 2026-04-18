import { List, type RowComponentProps } from 'react-window';
import TaskItem from './TaskItem';
import type { Task } from '../types/task';

interface Props {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

interface RowData {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const ITEM_HEIGHT = 80;
const MAX_VISIBLE = 6;

function Row({ index, style, tasks, onToggle, onDelete }: RowComponentProps<RowData>) {
  return (
    <div style={style}>
      <TaskItem task={tasks[index]} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

export default function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div style={{
        padding: '48px 24px', textAlign: 'center',
        color: '#c7c6c3', fontSize: 14, fontWeight: 500,
        userSelect: 'none',
      }}>
        No tasks yet — add one above.
      </div>
    );
  }

  const listHeight = Math.min(tasks.length, MAX_VISIBLE) * ITEM_HEIGHT;

  return (
    <List
      rowCount={tasks.length}
      rowHeight={ITEM_HEIGHT}
      rowComponent={Row}
      rowProps={{ tasks, onToggle, onDelete }}
      style={{ height: listHeight, width: '100%' }}
    />
  );
}
