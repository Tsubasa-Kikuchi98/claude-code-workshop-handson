// 統計計算
function calcStats() {
  var tasks = getTasks();
  return {
    total:      tasks.length,
    done:       tasks.filter(function(t) { return t.status === 'done'; }).length,
    inProgress: tasks.filter(function(t) { return t.status === 'in-progress'; }).length,
    todo:       tasks.filter(function(t) { return t.status === 'todo'; }).length,
    overdue:    tasks.filter(function(t) { return isOverdue(t); }).length,
  };
}

function countByStatus(tasks) {
  return {
    all:           tasks.length,
    'todo':        tasks.filter(function(t) { return t.status === 'todo'; }).length,
    'in-progress': tasks.filter(function(t) { return t.status === 'in-progress'; }).length,
    'done':        tasks.filter(function(t) { return t.status === 'done'; }).length,
  };
}

function countByCategory(tasks) {
  return tasks.reduce(function(acc, t) {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
}

function isOverdue(task) {
  if (!task.due || task.status === 'done') return false;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due) < today;
}
