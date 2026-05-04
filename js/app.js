var _currentView = 'list'; // 'list' | 'calendar'

function refresh() {
  var filtered = applyFilter(getTasks());

  if (_currentView === 'list') {
    renderTaskList(filtered);
  } else {
    renderCalendar(getTasks());
  }

  renderStats(calcStats());
  updateStatusCounts();
  renderCategoryFilters();
  updateViewButtons();
}

function updateViewButtons() {
  document.getElementById('btn-view-list').classList.toggle('active', _currentView === 'list');
  document.getElementById('btn-view-cal').classList.toggle('active',  _currentView === 'calendar');
}

function seedIfEmpty() {
  if (getTasks().length > 0) return;
  var today = new Date();
  function daysLater(n) {
    var d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + pad2(d.getMonth()+1) + '-' + pad2(d.getDate());
  }
  var samples = [
    { title: 'Claude Codeをセットアップする',    category: 'work',     priority: 'high',   status: 'done',        due: daysLater(-3), tags: ['setup'],          description: 'VS Code拡張とCLI両方を試す' },
    { title: 'CLAUDE.mdの書き方を学ぶ',           category: 'learning', priority: 'high',   status: 'in-progress', due: daysLater(2),  tags: ['claude', 'docs'], description: '公式ドキュメントを読んで実際に書いてみる' },
    { title: 'ハンズオン用プロジェクトを準備する',  category: 'work',     priority: 'medium', status: 'in-progress', due: daysLater(1),  tags: ['workshop'],       description: '' },
    { title: '第2回レジュメを確認する',             category: 'work',     priority: 'medium', status: 'todo',        due: daysLater(3),  tags: ['workshop'],       description: '' },
    { title: 'hooksの動作を確認する',               category: 'learning', priority: 'low',    status: 'todo',        due: daysLater(5),  tags: ['hooks'],          description: 'PostToolUseのサンプルを試す' },
    { title: 'チームへの共有資料を作る',             category: 'work',     priority: 'low',    status: 'todo',        due: daysLater(7),  tags: ['share'],          description: 'ワークショップで学んだことをまとめる' },
  ];
  samples.forEach(function(s) { addTask(s); });
}

function pad2(n) { return n < 10 ? '0' + n : String(n); }

function initStatusFilters() {
  document.querySelectorAll('#status-filters .filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setFilter({ status: btn.dataset.filter });
      setActiveFilterBtn('status', btn.dataset.filter);
      refresh();
    });
  });
}

function initSearch() {
  var input = document.getElementById('search-input');
  var timer;
  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(function() { setFilter({ query: input.value }); refresh(); }, 200);
  });
}

function initSort() {
  document.getElementById('sort-select').addEventListener('change', function(e) {
    setFilter({ sort: e.target.value }); refresh();
  });
}

function initViewToggle() {
  document.getElementById('btn-view-list').addEventListener('click', function() {
    _currentView = 'list';
    document.getElementById('task-list').classList.remove('hidden');
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('calendar-view').classList.add('hidden');
    refresh();
  });
  document.getElementById('btn-view-cal').addEventListener('click', function() {
    _currentView = 'calendar';
    document.getElementById('task-list').classList.add('hidden');
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('calendar-view').classList.remove('hidden');
    refresh();
  });
}

function initDrag() {
  var listEl = document.getElementById('task-list');
  initDragAndDrop(listEl, function(orderedIds) {
    reorderTasks(orderedIds);
  });
}

// 起動
seedIfEmpty();
initModal();
initStatusFilters();
initSearch();
initSort();
initViewToggle();
initDrag();
refresh();
