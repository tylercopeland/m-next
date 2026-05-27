import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskProgress, TaskProgressItem } from './TaskProgress';

describe('TaskProgress', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockTasks: TaskProgressItem[] = [
    { id: '1', label: 'User Roles', isCompleted: true },
    { id: '2', label: 'Features', isCompleted: true },
    { id: '3', label: 'Data Entities', isCompleted: false },
    { id: '4', label: 'Business Rules', isCompleted: false },
  ];

  it('renders with default title', () => {
    render(<TaskProgress tasks={mockTasks} />);
    expect(screen.getByTestId('task-progress-title')).toHaveTextContent('Your apps plan');
  });

  it('renders with custom title', () => {
    render(<TaskProgress tasks={mockTasks} title='Custom Title' />);
    expect(screen.getByTestId('task-progress-title')).toHaveTextContent('Custom Title');
  });

  it('renders all tasks', () => {
    render(<TaskProgress tasks={mockTasks} />);
    mockTasks.forEach((task) => {
      expect(screen.getByTestId(`task-progress-task-${task.id}`)).toBeInTheDocument();
    });
  });

  it('displays task labels', () => {
    render(<TaskProgress tasks={mockTasks} />);
    mockTasks.forEach((task) => {
      expect(screen.getByText(task.label)).toBeInTheDocument();
    });
  });

  it('calls onTaskClick when completed task is clicked', () => {
    const mockOnTaskClick = jest.fn();
    render(<TaskProgress tasks={mockTasks} onTaskClick={mockOnTaskClick} />);

    const firstTask = screen.getByTestId('task-progress-task-1');
    fireEvent.click(firstTask);

    expect(mockOnTaskClick).toHaveBeenCalledWith(mockTasks[0]);
    expect(mockOnTaskClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onTaskClick when incomplete task is clicked', () => {
    const mockOnTaskClick = jest.fn();
    render(<TaskProgress tasks={mockTasks} onTaskClick={mockOnTaskClick} />);

    const incompleteTask = screen.getByTestId('task-progress-task-3');
    fireEvent.click(incompleteTask);

    expect(mockOnTaskClick).not.toHaveBeenCalled();
  });

  it('applies pointer cursor to completed tasks', () => {
    render(<TaskProgress tasks={mockTasks} />);

    const completedTask = screen.getByTestId('task-progress-task-1');
    expect(completedTask).toHaveStyle({ cursor: 'pointer' });
  });

  it('applies default cursor to incomplete tasks', () => {
    render(<TaskProgress tasks={mockTasks} />);

    const incompleteTask = screen.getByTestId('task-progress-task-3');
    expect(incompleteTask).toHaveStyle({ cursor: 'default' });
  });

  it('handles mouse enter and leave on completed task', () => {
    render(<TaskProgress tasks={mockTasks} />);

    const completedTask = screen.getByTestId('task-progress-task-1');

    // Hover should work on completed tasks
    fireEvent.mouseEnter(completedTask);
    expect(completedTask).toBeInTheDocument();

    fireEvent.mouseLeave(completedTask);
    expect(completedTask).toBeInTheDocument();
  });

  it('handles mouse enter on incomplete task', () => {
    render(<TaskProgress tasks={mockTasks} />);

    const incompleteTask = screen.getByTestId('task-progress-task-3');

    // Mouse enter should still work but not show hover state
    fireEvent.mouseEnter(incompleteTask);
    expect(incompleteTask).toBeInTheDocument();

    fireEvent.mouseLeave(incompleteTask);
    expect(incompleteTask).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TaskProgress tasks={mockTasks} className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders empty task list', () => {
    render(<TaskProgress tasks={[]} />);
    expect(screen.getByTestId('task-progress-title')).toBeInTheDocument();
  });

  it('uses custom test ID', () => {
    render(<TaskProgress tasks={mockTasks} data-testid='custom-progress' />);
    expect(screen.getByTestId('custom-progress')).toBeInTheDocument();
    expect(screen.getByTestId('custom-progress-title')).toBeInTheDocument();
  });
});
