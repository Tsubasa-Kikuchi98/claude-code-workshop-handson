// フィルター・ソートロジック
var currentFilter = {
  status:   'all',
  category: 'all',
  query:    '',
  sort:     'created-desc',
};

function getFilter() {
  return Object.assign({}, currentFilter);
}

function setFilter(partial) {
  Object.assign(currentFilter, partial);
}

function applyFilter(tasks) {
  var f = currentFilter;
  var result = tasks.slice();

  if (f.status !== 'all') {
    result = result.filter(function(t) { return t.status === f.status; });
  }

  if (f.category !== 'all') {
    result = result.filter(function(t) { return t.category === f.category; });
  }

  if (f.query.trim()) {
    var q = f.query.trim().toLowerCase();
    result = result.filter(function(t) {
      return t.title.toLowerCase().indexOf(q) !== -1 ||
             t.description.toLowerCase().indexOf(q) !== -1;
    });
  }

  return sortTasks(result, f.sort);
}

function sortTasks(tasks, sort) {
  var order = { high: 0, medium: 1, low: 2 };
  return tasks.slice().sort(function(a, b) {
    if (sort === 'created-asc')   return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === 'created-desc')  return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === 'priority-desc') return order[a.priority] - order[b.priority];
    if (sort === 'due-asc') {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    }
    return 0;
  });
}
