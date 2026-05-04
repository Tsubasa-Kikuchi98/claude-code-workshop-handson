function initModal() {
  var catSelect = document.getElementById('task-category');
  CATEGORIES.forEach(function(cat) {
    var opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.label;
    catSelect.appendChild(opt);
  });

  document.getElementById('open-add-modal').addEventListener('click', function() { openModal(null); });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('task-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var id    = document.getElementById('task-id').value;
    var tagRaw = document.getElementById('task-tags').value;
    var tags  = tagRaw.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
    var fields = {
      title:       document.getElementById('task-title').value,
      description: document.getElementById('task-description').value,
      category:    document.getElementById('task-category').value,
      priority:    document.getElementById('task-priority').value,
      status:      document.getElementById('task-status').value,
      due:         document.getElementById('task-due').value,
      tags:        tags,
    };
    if (id) { updateTask(id, fields); } else { addTask(fields); }
    closeModal();
    refresh();
  });
}

function openModal(task) {
  document.getElementById('task-form').reset();
  if (task) {
    document.getElementById('modal-title').textContent       = 'タスクを編集';
    document.getElementById('task-id').value                 = task.id;
    document.getElementById('task-title').value              = task.title;
    document.getElementById('task-description').value        = task.description;
    document.getElementById('task-category').value           = task.category;
    document.getElementById('task-priority').value           = task.priority;
    document.getElementById('task-status').value             = task.status;
    document.getElementById('task-due').value                = task.due;
    document.getElementById('task-tags').value               = (task.tags || []).join(', ');
  } else {
    document.getElementById('modal-title').textContent = 'タスクを追加';
    document.getElementById('task-id').value = '';
  }
  document.getElementById('task-modal').classList.remove('hidden');
  document.getElementById('task-title').focus();
}

function closeModal() {
  document.getElementById('task-modal').classList.add('hidden');
}
