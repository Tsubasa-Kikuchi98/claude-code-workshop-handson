function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  var p = dateStr.split('-');
  return p[0] + '/' + p[1] + '/' + p[2];
}

function renderTaskList(tasks) {
  var list  = document.getElementById('task-list');
  var empty = document.getElementById('empty-state');
  list.innerHTML = '';

  if (tasks.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  tasks.forEach(function(task) { list.appendChild(createTaskCard(task)); });
}

function createTaskCard(task) {
  var card = document.createElement('div');
  card.className = 'task-card priority-' + task.priority + ' status-' + task.status;
  card.dataset.id = task.id;

  var cat     = CATEGORIES.find(function(c) { return c.id === task.category; });
  var overdue = isOverdue(task);
  var subs    = task.subtasks || [];
  var doneSubs = subs.filter(function(s) { return s.done; }).length;
  var tags    = (task.tags || []);

  var subtaskHtml = '';
  if (subs.length > 0) {
    var pct = Math.round(doneSubs / subs.length * 100);
    subtaskHtml =
      '<div class="subtask-progress">' +
        '<div class="subtask-bar"><div class="subtask-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="subtask-label">' + doneSubs + '/' + subs.length + '</span>' +
      '</div>';
  }

  var tagsHtml = tags.map(function(tag) {
    return '<span class="badge badge-tag">' + escapeHtml(tag) + '</span>';
  }).join('');

  var commentCount = (task.comments || []).length;

  card.innerHTML =
    '<input type="checkbox" class="task-checkbox"' + (task.status === 'done' ? ' checked' : '') + ' title="完了にする">' +
    '<div class="task-body">' +
      '<div class="task-title">' + escapeHtml(task.title) + '</div>' +
      (task.description ? '<div class="task-description">' + escapeHtml(task.description) + '</div>' : '') +
      '<div class="task-meta">' +
        (cat ? '<span class="badge badge-category">' + escapeHtml(cat.label) + '</span>' : '') +
        '<span class="badge badge-status-' + task.status + '">' + STATUS_LABELS[task.status] + '</span>' +
        '<span class="badge badge-priority-' + task.priority + '">' + PRIORITY_LABELS[task.priority] + '優先</span>' +
        tagsHtml +
        (task.due ? '<span class="task-due' + (overdue ? ' overdue' : '') + '">' + (overdue ? '⚠ ' : '') + '期限: ' + formatDate(task.due) + '</span>' : '') +
        (commentCount > 0 ? '<span class="task-comment-count">💬 ' + commentCount + '</span>' : '') +
      '</div>' +
      subtaskHtml +
    '</div>' +
    '<div class="task-actions">' +
      '<button class="btn btn-icon js-detail" title="詳細">📋</button>' +
      '<button class="btn btn-icon js-edit" title="編集">✏️</button>' +
      '<button class="btn btn-icon js-delete" title="削除">🗑️</button>' +
    '</div>';

  card.querySelector('.task-checkbox').addEventListener('change', function() {
    toggleDone(task.id); refresh();
  });
  card.querySelector('.js-edit').addEventListener('click', function() {
    openModal(getTaskById(task.id));
  });
  card.querySelector('.js-delete').addEventListener('click', function() {
    if (!confirm('このタスクを削除しますか？')) return;
    deleteTask(task.id); refresh();
  });
  card.querySelector('.js-detail').addEventListener('click', function() {
    openDetailPanel(task.id);
  });

  return card;
}

function renderStats(stats) {
  var panel = document.getElementById('stats-panel');
  panel.innerHTML =
    '<div class="stats-title">統計</div>' +
    '<div class="stats-grid">' +
      '<div class="stat-item"><span class="stat-number">' + stats.total + '</span><span class="stat-label">合計</span></div>' +
      '<div class="stat-item"><span class="stat-number">' + stats.done + '</span><span class="stat-label">完了</span></div>' +
      '<div class="stat-item"><span class="stat-number">' + stats.inProgress + '</span><span class="stat-label">進行中</span></div>' +
      '<div class="stat-item"><span class="stat-number" style="color:' + (stats.overdue > 0 ? 'var(--color-danger)' : 'inherit') + '">' + stats.overdue + '</span><span class="stat-label">期限超過</span></div>' +
    '</div>';
}

function renderCategoryFilters() {
  var allTasks  = getTasks();
  var catCounts = countByCategory(allTasks);
  var list = document.getElementById('category-filters');
  list.innerHTML = '';

  var allLi = document.createElement('li');
  allLi.innerHTML = '<button class="filter-btn" data-category="all">すべて<span class="filter-count">' + allTasks.length + '</span></button>';
  list.appendChild(allLi);

  CATEGORIES.forEach(function(cat) {
    var li = document.createElement('li');
    li.innerHTML = '<button class="filter-btn" data-category="' + cat.id + '">' + escapeHtml(cat.label) + '<span class="filter-count">' + (catCounts[cat.id] || 0) + '</span></button>';
    list.appendChild(li);
  });

  list.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setFilter({ category: btn.dataset.category });
      setActiveFilterBtn('category', btn.dataset.category);
      refresh();
    });
  });
}

function updateStatusCounts() {
  var counts = countByStatus(getTasks());
  document.querySelectorAll('#status-filters .filter-btn').forEach(function(btn) {
    var key = btn.dataset.filter;
    var el  = btn.querySelector('.filter-count');
    if (!el) { el = document.createElement('span'); el.className = 'filter-count'; btn.appendChild(el); }
    el.textContent = counts[key] !== undefined ? counts[key] : 0;
  });
}

function setActiveFilterBtn(type, value) {
  var sel = type === 'status' ? '#status-filters .filter-btn' : '#category-filters .filter-btn';
  document.querySelectorAll(sel).forEach(function(btn) {
    var key = type === 'status' ? btn.dataset.filter : btn.dataset.category;
    btn.classList.toggle('active', key === value);
  });
}

/* ---- 詳細パネル ---- */
function openDetailPanel(taskId) {
  var task = getTaskById(taskId);
  if (!task) return;

  var existing = document.getElementById('detail-panel');
  if (existing) existing.remove();

  var panel = document.createElement('div');
  panel.id = 'detail-panel';
  panel.className = 'detail-panel';
  panel.innerHTML = buildDetailHTML(task);
  document.body.appendChild(panel);

  bindDetailEvents(panel, task.id);

  setTimeout(function() { panel.classList.add('open'); }, 10);
}

function buildDetailHTML(task) {
  var subs     = task.subtasks || [];
  var comments = task.comments || [];
  var tags     = task.tags || [];

  var subsHtml = subs.map(function(s) {
    return '<div class="subtask-item">' +
      '<input type="checkbox" class="js-sub-toggle" data-subid="' + s.id + '"' + (s.done ? ' checked' : '') + '>' +
      '<span class="' + (s.done ? 'done-text' : '') + '">' + escapeHtml(s.title) + '</span>' +
      '<button class="btn btn-icon js-sub-delete" data-subid="' + s.id + '">✕</button>' +
    '</div>';
  }).join('');

  var commentsHtml = comments.map(function(c) {
    var dt = new Date(c.createdAt);
    var ts = dt.getFullYear() + '/' + pad2(dt.getMonth()+1) + '/' + pad2(dt.getDate()) + ' ' + pad2(dt.getHours()) + ':' + pad2(dt.getMinutes());
    return '<div class="comment-item">' +
      '<div class="comment-meta">' + ts + '<button class="btn btn-icon js-comment-delete" data-cid="' + c.id + '">✕</button></div>' +
      '<div class="comment-text">' + escapeHtml(c.text) + '</div>' +
    '</div>';
  }).join('');

  var tagsHtml = tags.map(function(tag) {
    return '<span class="badge badge-tag js-tag-item" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + ' <span class="tag-remove">✕</span></span>';
  }).join('');

  return '<div class="detail-header">' +
    '<h2 class="detail-title">' + escapeHtml(task.title) + '</h2>' +
    '<button class="modal-close" id="detail-close">&times;</button>' +
  '</div>' +
  '<div class="detail-body">' +
    '<section class="detail-section">' +
      '<h3 class="detail-section-title">タグ</h3>' +
      '<div class="tag-list" id="detail-tags">' + tagsHtml + '</div>' +
      '<div class="tag-input-row">' +
        '<input class="form-input tag-input" id="detail-tag-input" placeholder="タグを追加...">' +
        '<button class="btn btn-secondary js-add-tag">追加</button>' +
      '</div>' +
    '</section>' +
    '<section class="detail-section">' +
      '<h3 class="detail-section-title">サブタスク</h3>' +
      '<div id="detail-subtasks">' + subsHtml + '</div>' +
      '<div class="subtask-input-row">' +
        '<input class="form-input subtask-input" id="detail-sub-input" placeholder="サブタスクを追加...">' +
        '<button class="btn btn-secondary js-add-sub">追加</button>' +
      '</div>' +
    '</section>' +
    '<section class="detail-section">' +
      '<h3 class="detail-section-title">コメント</h3>' +
      '<div id="detail-comments">' + commentsHtml + '</div>' +
      '<div class="comment-input-row">' +
        '<textarea class="form-input form-textarea comment-textarea" id="detail-comment-input" placeholder="コメントを追加..."></textarea>' +
        '<button class="btn btn-secondary js-add-comment">投稿</button>' +
      '</div>' +
    '</section>' +
  '</div>';
}

function bindDetailEvents(panel, taskId) {
  panel.querySelector('#detail-close').addEventListener('click', function() {
    panel.classList.remove('open');
    setTimeout(function() { panel.remove(); }, 300);
  });

  // サブタスク追加
  function addSub() {
    var input = panel.querySelector('#detail-sub-input');
    if (!input.value.trim()) return;
    addSubtask(taskId, input.value);
    input.value = '';
    refreshDetail(panel, taskId);
    refresh();
  }
  panel.querySelector('.js-add-sub').addEventListener('click', addSub);
  panel.querySelector('#detail-sub-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); addSub(); }
  });

  // サブタスク操作（委譲）
  panel.querySelector('#detail-subtasks').addEventListener('change', function(e) {
    if (!e.target.classList.contains('js-sub-toggle')) return;
    toggleSubtask(taskId, e.target.dataset.subid);
    refreshDetail(panel, taskId);
    refresh();
  });
  panel.querySelector('#detail-subtasks').addEventListener('click', function(e) {
    var btn = e.target.closest('.js-sub-delete');
    if (!btn) return;
    deleteSubtask(taskId, btn.dataset.subid);
    refreshDetail(panel, taskId);
    refresh();
  });

  // コメント追加
  function addCmt() {
    var input = panel.querySelector('#detail-comment-input');
    if (!input.value.trim()) return;
    addComment(taskId, input.value);
    input.value = '';
    refreshDetail(panel, taskId);
    refresh();
  }
  panel.querySelector('.js-add-comment').addEventListener('click', addCmt);

  // コメント削除
  panel.querySelector('#detail-comments').addEventListener('click', function(e) {
    var btn = e.target.closest('.js-comment-delete');
    if (!btn) return;
    deleteComment(taskId, btn.dataset.cid);
    refreshDetail(panel, taskId);
    refresh();
  });

  // タグ追加
  function addTagHandler() {
    var input = panel.querySelector('#detail-tag-input');
    var tag   = input.value.trim();
    if (!tag) return;
    var task  = getTaskById(taskId);
    if (!task) return;
    var tags  = (task.tags || []);
    if (tags.indexOf(tag) === -1) {
      updateTask(taskId, { tags: tags.concat([tag]) });
    }
    input.value = '';
    refreshDetail(panel, taskId);
    refresh();
  }
  panel.querySelector('.js-add-tag').addEventListener('click', addTagHandler);
  panel.querySelector('#detail-tag-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); addTagHandler(); }
  });

  // タグ削除
  panel.querySelector('#detail-tags').addEventListener('click', function(e) {
    var item = e.target.closest('.js-tag-item');
    if (!item) return;
    var tag  = item.dataset.tag;
    var task = getTaskById(taskId);
    if (!task) return;
    updateTask(taskId, { tags: task.tags.filter(function(t) { return t !== tag; }) });
    refreshDetail(panel, taskId);
    refresh();
  });
}

function refreshDetail(panel, taskId) {
  var task = getTaskById(taskId);
  if (!task) return;
  panel.innerHTML = buildDetailHTML(task);
  bindDetailEvents(panel, taskId);
}

function pad2(n) { return n < 10 ? '0' + n : String(n); }
