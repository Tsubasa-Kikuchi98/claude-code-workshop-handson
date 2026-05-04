var _tasks = loadTasks();

function getTasks() { return _tasks; }

function getTaskById(id) {
  return _tasks.find(function(t) { return t.id === id; }) || null;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function addTask(fields) {
  var task = {
    id:          generateId(),
    title:       fields.title.trim(),
    description: (fields.description || '').trim(),
    category:    fields.category || 'other',
    priority:    fields.priority || 'medium',
    status:      fields.status  || 'todo',
    due:         fields.due     || '',
    tags:        fields.tags    || [],
    subtasks:    [],
    comments:    [],
    order:       _tasks.length,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };
  _tasks = [task].concat(_tasks);
  saveTasks(_tasks);
  return task;
}

function updateTask(id, changes) {
  _tasks = _tasks.map(function(t) {
    if (t.id !== id) return t;
    return Object.assign({}, t, changes, { updatedAt: new Date().toISOString() });
  });
  saveTasks(_tasks);
  return getTaskById(id);
}

function deleteTask(id) {
  _tasks = _tasks.filter(function(t) { return t.id !== id; });
  saveTasks(_tasks);
}

function toggleDone(id) {
  var task = getTaskById(id);
  if (!task) return null;
  return updateTask(id, { status: task.status === 'done' ? 'todo' : 'done' });
}

function reorderTasks(orderedIds) {
  var map = {};
  _tasks.forEach(function(t) { map[t.id] = t; });
  var reordered = orderedIds.map(function(id, i) {
    return Object.assign({}, map[id], { order: i });
  });
  var rest = _tasks.filter(function(t) { return orderedIds.indexOf(t.id) === -1; });
  _tasks = reordered.concat(rest);
  saveTasks(_tasks);
}

/* ---- サブタスク ---- */
function addSubtask(taskId, title) {
  var task = getTaskById(taskId);
  if (!task) return;
  var sub = { id: generateId(), title: title.trim(), done: false };
  var subtasks = (task.subtasks || []).concat([sub]);
  updateTask(taskId, { subtasks: subtasks });
  return sub;
}

function toggleSubtask(taskId, subId) {
  var task = getTaskById(taskId);
  if (!task) return;
  var subtasks = (task.subtasks || []).map(function(s) {
    return s.id === subId ? Object.assign({}, s, { done: !s.done }) : s;
  });
  updateTask(taskId, { subtasks: subtasks });
}

function deleteSubtask(taskId, subId) {
  var task = getTaskById(taskId);
  if (!task) return;
  updateTask(taskId, { subtasks: task.subtasks.filter(function(s) { return s.id !== subId; }) });
}

/* ---- コメント ---- */
function addComment(taskId, text) {
  var task = getTaskById(taskId);
  if (!task) return;
  var comment = { id: generateId(), text: text.trim(), createdAt: new Date().toISOString() };
  var comments = (task.comments || []).concat([comment]);
  updateTask(taskId, { comments: comments });
  return comment;
}

function deleteComment(taskId, commentId) {
  var task = getTaskById(taskId);
  if (!task) return;
  updateTask(taskId, { comments: task.comments.filter(function(c) { return c.id !== commentId; }) });
}

/* ---- タグ ---- */
function getAllTags() {
  var set = {};
  _tasks.forEach(function(t) {
    (t.tags || []).forEach(function(tag) { set[tag] = true; });
  });
  return Object.keys(set).sort();
}
