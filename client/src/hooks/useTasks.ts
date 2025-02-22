import { useState } from 'react';
import { Task, Subtask } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const createTask = (
    newTask: Omit<Task, 'id' | 'completed' | 'collapsed' | 'subtasks'>
  ) => {
    setTasks(prevTasks => [
      ...prevTasks,
      {
        id: Date.now(),
        ...newTask,
        completed: false,
        collapsed: false,
        subtasks: []
      }
    ]);
  };

  const deleteSubtaskRecursive = (
    subtasks: Subtask[],
    subtaskId: number
  ): Subtask[] => {
    return subtasks.filter((subtask) => {
      if (subtask.id === subtaskId) return false;
      if (subtask.subtasks) {
        subtask.subtasks = deleteSubtaskRecursive(subtask.subtasks, subtaskId);
      }
      return true;
    });
  };

  const deleteTask = (taskId: number, subtaskId?: number) => {
    if (subtaskId === undefined) {
      setTasks(prevTasks => prevTasks.filter((task) => task.id !== taskId));
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks
              ? deleteSubtaskRecursive(task.subtasks, subtaskId)
              : []
          };
        }
        return task;
      })
    );
  };

  const toggleCollapse = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, collapsed: !task.collapsed };
        }
        return task;
      })
    );
  };

  const addSubtaskRecursive = (
    subtasks: Subtask[],
    parentSubtaskId: number,
    newSubtask: Subtask
  ): Subtask[] => {
    return subtasks.map((subtask) => {
      if (subtask.id === parentSubtaskId) {
        return {
          ...subtask,
          subtasks: [...(subtask.subtasks || []), newSubtask]
        };
      }
      if (subtask.subtasks && subtask.subtasks.length > 0) {
        return {
          ...subtask,
          subtasks: addSubtaskRecursive(subtask.subtasks, parentSubtaskId, newSubtask)
        };
      }
      return subtask;
    });
  };

  const addSubtask = (taskId: number, parentSubtaskId?: number) => {
    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newSubtask: Subtask = {
            id: Date.now(),
            name: 'New Subtask',
            completed: false,
            subtasks: []
          };

          if (parentSubtaskId === undefined) {
            return {
              ...task,
              subtasks: [...(task.subtasks || []), newSubtask]
            };
          }

          return {
            ...task,
            subtasks: task.subtasks
              ? addSubtaskRecursive(task.subtasks, parentSubtaskId, newSubtask)
              : []
          };
        }
        return task;
      })
    );
  };

  const toggleComplete = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const toggleSubtaskCompleteRecursive = (
    subtasks: Subtask[],
    subtaskId: number
  ): [Subtask[], boolean] => {
    const updatedSubtasks = subtasks.map((subtask) => {
      if (subtask.id === subtaskId) {
        const newCompleted = !subtask.completed;
        return {
          ...subtask,
          completed: newCompleted,
          subtasks:
            subtask.subtasks && subtask.subtasks.length > 0
              ? subtask.subtasks.map((s) => ({ ...s, completed: newCompleted }))
              : []
        };
      }
      if (subtask.subtasks && subtask.subtasks.length > 0) {
        const [updatedNestedSubtasks] = toggleSubtaskCompleteRecursive(
          subtask.subtasks,
          subtaskId
        );
        return {
          ...subtask,
          subtasks: updatedNestedSubtasks,
          completed: updatedNestedSubtasks.every((child) => child.completed)
        };
      }
      return subtask;
    });

    const allCompleted = updatedSubtasks.every((subtask) => {
      if (subtask.subtasks && subtask.subtasks.length > 0) {
        return subtask.subtasks.every((child) => child.completed);
      }
      return subtask.completed;
    });
    return [updatedSubtasks, allCompleted];
  };

  const toggleSubtaskComplete = (taskId: number, subtaskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId && task.subtasks) {
          const [updatedSubtasks, allSubtasksCompleted] =
            toggleSubtaskCompleteRecursive(task.subtasks, subtaskId);
          return {
            ...task,
            subtasks: updatedSubtasks,
            completed: allSubtasksCompleted
          };
        }
        return task;
      })
    );
  };

  const updateTaskName = (taskId: number, newName: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, name: newName };
        }
        return task;
      })
    );
  };

  const updateSubtaskNameRecursive = (
    subtasks: Subtask[],
    subtaskId: number,
    newName: string
  ): Subtask[] => {
    return subtasks.map((subtask) => {
      if (subtask.id === subtaskId) {
        return { ...subtask, name: newName };
      }
      if (subtask.subtasks && subtask.subtasks.length > 0) {
        return {
          ...subtask,
          subtasks: updateSubtaskNameRecursive(subtask.subtasks, subtaskId, newName)
        };
      }
      return subtask;
    });
  };

  const updateSubtaskName = (taskId: number, subtaskId: number, newName: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks
              ? updateSubtaskNameRecursive(task.subtasks, subtaskId, newName)
              : []
          };
        }
        return task;
      })
    );
  };

  return {
    tasks,
    setTasks, // Expose the setter for a single source of truth.
    createTask,
    deleteTask,
    toggleCollapse,
    addSubtask,
    toggleComplete,
    toggleSubtaskComplete,
    updateTaskName,
    updateSubtaskName
  };
};
