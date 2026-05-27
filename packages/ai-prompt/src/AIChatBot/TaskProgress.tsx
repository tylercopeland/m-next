import React, { useCallback } from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { TaskProgressContainer, TaskProgressTitle, TaskList, TaskItem, TaskSpinner } from './AIChatBot.styles';

export interface TaskProgressItem {
  /** Unique identifier for the task */
  id: string;
  /** Task label/name */
  label: string;
  /** Whether the task is completed */
  isCompleted: boolean;
}

export interface TaskProgressProps {
  /** Title for the progress section */
  title?: string;
  /** Array of task items */
  tasks: TaskProgressItem[];
  /** Callback when a task is clicked */
  onTaskClick?: (task: TaskProgressItem) => void;
  /** Additional CSS class name */
  className?: string;
  /** Test ID for the component */
  'data-testid'?: string;
}

export function TaskProgress({
  title = 'Your apps plan',
  tasks,
  onTaskClick,
  className,
  'data-testid': testId,
}: TaskProgressProps) {
  const containerTestId = testId || 'task-progress';

  const handleTaskClick = useCallback(
    (task: TaskProgressItem) => {
      if (task.isCompleted) {
        onTaskClick?.(task);
      }
    },
    [onTaskClick],
  );

  return (
    <TaskProgressContainer className={className} data-testid={containerTestId}>
      <TaskProgressTitle data-testid={`${containerTestId}-title`}>{title}</TaskProgressTitle>
      <TaskList>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            isCompleted={task.isCompleted}
            onClick={() => handleTaskClick(task)}
            data-testid={`${containerTestId}-task-${task.id}`}
            type='button'
          >
            <div className='task-content'>
              {task.isCompleted ? (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SvgIcon name='check-circle-filled' size={16} color={colors['green']} />
                </div>
              ) : (
                <TaskSpinner />
              )}
              <div className='task-label'>{task.label}</div>
              {task.isCompleted && <SvgIcon name='arrow-right' size={12} color={colors['grey']} />}
            </div>
          </TaskItem>
        ))}
      </TaskList>
    </TaskProgressContainer>
  );
}

export default TaskProgress;
