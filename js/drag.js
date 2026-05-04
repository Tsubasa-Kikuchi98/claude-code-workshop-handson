// ドラッグ&ドロップ並び替え（vanilla JS）
function initDragAndDrop(listEl, onReorder) {
  var dragging = null;
  var placeholder = null;

  function createPlaceholder(height) {
    var el = document.createElement('div');
    el.className = 'drag-placeholder';
    el.style.height = height + 'px';
    return el;
  }

  listEl.addEventListener('dragstart', function(e) {
    var card = e.target.closest('.task-card');
    if (!card) return;
    dragging = card;
    placeholder = createPlaceholder(card.offsetHeight);
    setTimeout(function() { card.classList.add('dragging'); }, 0);
    e.dataTransfer.effectAllowed = 'move';
  });

  listEl.addEventListener('dragend', function() {
    if (!dragging) return;
    dragging.classList.remove('dragging');
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.replaceChild(dragging, placeholder);
    }
    var ids = Array.from(listEl.querySelectorAll('.task-card')).map(function(c) { return c.dataset.id; });
    onReorder(ids);
    dragging = null;
    placeholder = null;
  });

  listEl.addEventListener('dragover', function(e) {
    e.preventDefault();
    if (!dragging) return;
    var target = e.target.closest('.task-card');
    if (!target || target === dragging) return;

    var rect = target.getBoundingClientRect();
    var mid  = rect.top + rect.height / 2;
    if (e.clientY < mid) {
      listEl.insertBefore(placeholder, target);
    } else {
      listEl.insertBefore(placeholder, target.nextSibling);
    }
  });

  listEl.addEventListener('drop', function(e) { e.preventDefault(); });

  // カードにdraggable属性を付与するオブザーバー
  var observer = new MutationObserver(function() {
    listEl.querySelectorAll('.task-card:not([draggable])').forEach(function(card) {
      card.setAttribute('draggable', 'true');
    });
  });
  observer.observe(listEl, { childList: true, subtree: false });

  listEl.querySelectorAll('.task-card').forEach(function(card) {
    card.setAttribute('draggable', 'true');
  });
}
