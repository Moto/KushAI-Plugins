// Productivity plugin script
function productivityPlugin(kushai) {
  // In-memory storage for tasks
  const tasks = [];
  
  // Add a command to add a task
  kushai.addCommand('add-task', 'Add a new task to your list', (args) => {
    if (args.length === 0) {
      return "Please provide a task description";
    }
    
    const task = {
      id: tasks.length + 1,
      description: args.join(' '),
      completed: false,
      createdAt: new Date()
    };
    
    tasks.push(task);
    return `Task added: ${task.description}`;
  });
  
  // Add a command to list tasks
  kushai.addCommand('list-tasks', 'List all tasks', (args) => {
    if (tasks.length === 0) {
      return "You have no tasks. Add some tasks with /add-task";
    }
    
    const taskList = tasks.map(task => 
      `${task.id}. ${task.description} ${task.completed ? '(completed)' : ''}`
    ).join('\n');
    
    return `Your tasks:\n${taskList}`;
  });
  
  // Add a command to mark a task as completed
  kushai.addCommand('complete-task', 'Mark a task as completed', (args) => {
    if (args.length === 0) {
      return "Please provide a task ID";
    }
    
    const taskId = parseInt(args[0]);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      return `Task with ID ${taskId} not found`;
    }
    
    task.completed = true;
    return `Task marked as completed: ${task.description}`;
  });
}

module.exports = productivityPlugin;