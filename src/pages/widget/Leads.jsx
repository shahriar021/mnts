import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Avatar, IconButton, TextField, Button, Tooltip, Container, styled } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';

const Column = styled(Box)(({ theme, bgcolor }) => ({
  minWidth: 300,
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: bgcolor,
  borderRadius: theme.spacing(1),
  height: 'calc(100vh - 100px)',
  overflowY: 'auto'
}));

const TaskCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  cursor: 'grab',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const Leads = () => {
  const [tasks, setTasks] = useState({
    taskReadiness: [
      {
        id: '1',
        title: 'Implement Login',
        description: 'Create login functionality with OAuth',
        priority: 'High',
        dueDate: new Date(2024, 0, 15),
        assignee: {
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
        }
      }
    ],
    workInProgress: [
      {
        id: '2',
        title: 'Design Dashboard',
        description: 'Create responsive dashboard layout',
        priority: 'Medium',
        dueDate: new Date(2024, 0, 20),
        assignee: {
          name: 'Jane Smith',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
        }
      }
    ],
    reviewNeeded: [],
    completed: []
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: new Date(),
    assignee: {
      name: 'Unassigned',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    }
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    const sourceTasks = [...tasks[sourceColumn]];
    const destTasks = sourceColumn === destColumn ? sourceTasks : [...tasks[destColumn]];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destColumn]: destTasks
    });
  };

  const handleAddTask = (column) => {
    const newTaskWithId = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTasks({
      ...tasks,
      [column]: [...tasks[column], newTaskWithId]
    });
    setNewTask({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: new Date(),
      assignee: {
        name: 'Unassigned',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
      }
    });
  };

  const handleDeleteTask = (columnId, taskId) => {
    setTasks({
      ...tasks,
      [columnId]: tasks[columnId].filter((task) => task.id !== taskId)
    });
  };

  const columns = [
    { id: 'taskReadiness', title: 'Task Readiness', bgcolor: '#bbdefb' },
    { id: 'workInProgress', title: 'Work in Progress', bgcolor: '#fff3e0' },
    { id: 'reviewNeeded', title: 'Review Needed', bgcolor: '#ffe0b2' },
    { id: 'completed', title: 'Completed', bgcolor: '#c8e6c9' }
  ];

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          minHeight: 'calc(100vh - 32px)',
          padding: 2
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <Column key={column.id} bgcolor={column.bgcolor}>
              <Typography variant="h6" gutterBottom>
                {column.title}
              </Typography>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 100 }}>
                    {tasks[column.id].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <TaskCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">{task.title}</Typography>
                                <Box>
                                  <IconButton size="small">
                                    <FaEdit />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteTask(column.id, task.id)}>
                                    <FaTrash />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="textSecondary">
                                {task.description}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  mt: 2
                                }}
                              >
                                <Avatar src={task.assignee.avatar} alt={task.assignee.name} />
                                <Typography variant="caption">Due: {format(task.dueDate, 'MM/dd/yyyy')}</Typography>
                                <Tooltip title={`Priority: ${task.priority}`}>
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      backgroundColor:
                                        task.priority === 'High' ? '#f44336' : task.priority === 'Medium' ? '#ff9800' : '#4caf50'
                                    }}
                                  />
                                </Tooltip>
                              </Box>
                            </CardContent>
                          </TaskCard>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Box sx={{ p: 1 }}>
                      <Button startIcon={<FaPlus />} variant="contained" fullWidth onClick={() => handleAddTask(column.id)}>
                        Add Task
                      </Button>
                    </Box>
                  </Box>
                )}
              </Droppable>
            </Column>
          ))}
        </DragDropContext>
      </Box>
    </Container>
  );
};

export default Leads;
