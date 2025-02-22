import { Box, VStack, Text, Flex, Tag, IconButton, Collapse, Input, Circle } from '@chakra-ui/react';
import { AddIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon, StarIcon } from '@chakra-ui/icons';
import SubtaskCard from './SubtaskCard';
import { useState } from 'react';

interface Subtask {
  id: number;
  name: string;
  completed: boolean;
  subtasks?: Subtask[];
}

interface Task {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  collapsed?: boolean;
  subtasks?: Subtask[];
  priority?: string;
}

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => void;
  onToggleCollapse: (taskId: number) => void;
  onAddSubtask: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
  onToggleSubtaskComplete: (taskId: number, subtaskId: number) => void;
  onUpdateName: (taskId: number, newName: string) => void;
  onUpdateSubtaskName: (taskId: number, subtaskId: number, newName: string) => void;
}

interface DragProps {
  onDragStart: (type: 'subtask' | 'sub-subtask', taskId: number, itemId: number, parentId?: number) => void;
  onDrop: (taskId: number, parentId?: number) => void;
  dragState: {
    type: 'subtask' | 'sub-subtask';
    sourceTaskId: number;
    sourceParentId?: number;
    itemId: number;
  } | null;
}

const TaskCard = ({
  task,
  onDelete,
  onToggleCollapse,
  onAddSubtask,
  onToggleComplete,
  onToggleSubtaskComplete,
  onUpdateName,
  onUpdateSubtaskName,
  onDragStart,
  onDrop,
  dragState
}: TaskCardProps & DragProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedName(task.name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = () => {
    if (editedName.trim()) {
      onUpdateName(task.id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(task.name);
    }
  };

  // Passes subtask name updates down to the parent callback.
  const handleSubtaskNameUpdate = (taskId: number, subtaskId: number, newName: string) => {
    onUpdateSubtaskName(taskId, subtaskId, newName);
  };

  return (
    <Box
      // Top-level tasks are not draggable so we removed draggable/onDragStart handlers.
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.boxShadow = '0 0 0 2px var(--chakra-colors-purple-500)';
        e.currentTarget.style.transition = 'box-shadow 0.2s ease-in-out';
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        e.currentTarget.style.boxShadow = 'none';
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.boxShadow = 'none';
        onDrop(task.id);
      }}
      bg={task.completed ? "gray.700" : "gray.800"}
      p={5}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={task.completed ? "green.500" : "gray.700"}
      position="relative"
      height="fit-content"
      transition="all 0.2s ease-in-out"
      transform={task.completed ? "scale(0.98)" : "scale(1)"}
      cursor="default"
      _hover={{
        borderColor: "purple.500",
        transform: "translateY(-2px)"
      }}
      _after={task.completed ? {
        content: '""',
        position: "absolute",
        top: "-1px",
        right: "-1px",
        bottom: "-1px",
        left: "-1px",
        background: "green.500",
        opacity: 0.1,
        borderRadius: "lg",
        zIndex: -1,
        transition: "opacity 0.3s ease-in-out"
      } : undefined}
    >
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <IconButton
            icon={<CloseIcon />}
            aria-label="Delete task"
            colorScheme="red"
            size="sm"
            onClick={() => onDelete(task.id)}
          />
          {isEditing ? (
            <Input
              value={editedName}
              onChange={handleNameChange}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              color="white"
              bg="gray.700"
              fontSize="lg"
              flex="1"
              mx={4}
              autoFocus
              _focus={{
                borderColor: "purple.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)"
              }}
            />
          ) : (
            <Text
              color="white"
              fontSize="lg"
              textDecoration={task.completed ? 'line-through' : 'none'}
              opacity={task.completed ? 0.6 : 1}
              flex="1"
              mx={4}
              onDoubleClick={handleDoubleClick}
              cursor="text"
              title="Double click to edit"
              _hover={{
                bg: "gray.700",
                borderRadius: "md",
                px: 2,
                mx: 2
              }}
            >
              {task.name}
            </Text>
          )}
          <Flex gap={2}>
            <IconButton
              icon={task.collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
              aria-label="Toggle collapse"
              colorScheme={task.collapsed ? "gray" : "teal"}
              variant="solid"
              size="sm"
              onClick={() => onToggleCollapse(task.id)}
            />
            <IconButton
              icon={<AddIcon />}
              aria-label="Add subtask"
              colorScheme="blue"
              size="sm"
              onClick={() => onAddSubtask(task.id)}
            />
          </Flex>
        </Flex>

        <Flex align="center" gap={2}>
          <Tag colorScheme="purple" size="sm" width="fit-content">
            {task.category}
          </Tag>
          {task.priority && (
            <Circle size="24px" bg={task.priority} title="Priority Level" transition="all 0.2s ease-in-out" _hover={{ transform: "scale(1.1)" }}>
              <StarIcon color="white" boxSize={4} />
            </Circle>
          )}
        </Flex>

        <Collapse
          in={!task.collapsed}
          style={{
            transformOrigin: 'top',
            position: 'relative',
            width: '100%'
          }}
          animateOpacity
        >
          {task.subtasks && task.subtasks.length > 0 && (
            <VStack align="stretch" pl={4} spacing={2}>
              {task.subtasks.map((subtask) => (
                <SubtaskCard
                  key={subtask.id}
                  taskId={task.id}
                  subtask={subtask}
                  onDelete={onDelete}
                  onAddSubtask={onAddSubtask}
                  onToggleComplete={onToggleSubtaskComplete}
                  onUpdateName={handleSubtaskNameUpdate}
                  onDragStart={(type, taskId, itemId, parentId) => 
                    onDragStart(type as 'subtask' | 'sub-subtask', taskId, itemId, parentId)}
                  onDrop={onDrop}
                  dragState={dragState}
                />
              ))}
            </VStack>
          )}
        </Collapse>
      </VStack>
    </Box>
  );
};

export default TaskCard;
