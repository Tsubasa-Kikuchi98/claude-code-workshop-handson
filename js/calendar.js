// カレンダービュー
var _calYear  = new Date().getFullYear();
var _calMonth = new Date().getMonth();

function renderCalendar(tasks) {
  var el = document.getElementById('calendar-view');
  if (!el) return;

  var year  = _calYear;
  var month = _calMonth;

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();

  var tasksByDate = {};
  tasks.forEach(function(t) {
    if (!t.due) return;
    if (!tasksByDate[t.due]) tasksByDate[t.due] = [];
    tasksByDate[t.due].push(t);
  });

  var monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var dayNames   = ['日','月','火','水','木','金','土'];

  var todayStr = toDateString(new Date());

  var html =
    '<div class="cal-header">' +
      '<button class="btn btn-icon cal-prev">&#8249;</button>' +
      '<span class="cal-title">' + year + '年 ' + monthNames[month] + '</span>' +
      '<button class="btn btn-icon cal-next">&#8250;</button>' +
    '</div>' +
    '<div class="cal-grid">' +
      dayNames.map(function(d, i) {
        return '<div class="cal-day-name' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '') + '">' + d + '</div>';
      }).join('');

  var startBlank = firstDay;
  for (var i = 0; i < startBlank; i++) {
    html += '<div class="cal-cell cal-cell--empty"></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year + '-' + pad(month + 1) + '-' + pad(d);
    var dayTasks = tasksByDate[dateStr] || [];
    var isToday  = dateStr === todayStr;
    var dow = (firstDay + d - 1) % 7;

    html += '<div class="cal-cell' +
      (isToday ? ' cal-cell--today' : '') +
      (dow === 0 ? ' cal-cell--sun' : dow === 6 ? ' cal-cell--sat' : '') +
      '" data-date="' + dateStr + '">' +
      '<span class="cal-date-num">' + d + '</span>';

    dayTasks.slice(0, 3).forEach(function(t) {
      html += '<div class="cal-task priority-' + t.priority + ' status-' + t.status + '" data-id="' + t.id + '" title="' + escapeHtml(t.title) + '">' +
        escapeHtml(t.title) +
      '</div>';
    });
    if (dayTasks.length > 3) {
      html += '<div class="cal-task-more">+' + (dayTasks.length - 3) + '件</div>';
    }

    html += '</div>';
  }

  html += '</div>';
  el.innerHTML = html;

  el.querySelector('.cal-prev').addEventListener('click', function() {
    _calMonth--;
    if (_calMonth < 0) { _calMonth = 11; _calYear--; }
    renderCalendar(getTasks());
  });
  el.querySelector('.cal-next').addEventListener('click', function() {
    _calMonth++;
    if (_calMonth > 11) { _calMonth = 0; _calYear++; }
    renderCalendar(getTasks());
  });

  el.querySelectorAll('.cal-task').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var task = getTaskById(el.dataset.id);
      if (task) openModal(task);
    });
  });
}

function pad(n) { return n < 10 ? '0' + n : String(n); }

function toDateString(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
