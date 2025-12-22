const listContainer = document.getElementById('listContainer');
const addBtn = document.getElementById('addBtn');
const itemText = document.getElementById('itemText');
const itemNotes = document.getElementById('itemNotes');
const itemCategory = document.getElementById('itemCategory');
const itemPriority = document.getElementById('itemPriority');
const itemDate = document.getElementById('itemDate');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const remainingCount = document.getElementById('remainingCount');

let items = [];
let draggedItem = null;
let expandedCategories = new Set();

const genId = () => 'id-' + Date.now() + Math.random().toString(36).slice(2);

async function load() {
  const res = await fetch("http://localhost:8000/items");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}


async function save() {
  await fetch("http://localhost:8000/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  });
}


function updateStats() {
  const total = items.length;
  const completed = items.filter(i => i.completed).length;
  const remaining = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  remainingCount.textContent = remaining;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function groupByCategory(items) {
  const categories = ['Travel', 'Career', 'Learning', 'Adventure', 'Health', 'Fun','Bike', 'Food','Games', 'Personal', 'Other'];
  const grouped = {};
  
  categories.forEach(cat => {
    const categoryItems = items.filter(item => item.category === cat);
    if (categoryItems.length > 0) {
      grouped[cat] = categoryItems;
    }
  });

  // Uncategorized items
  const uncategorized = items.filter(item => !item.category || item.category === '');
  if (uncategorized.length > 0) {
    grouped['Uncategorized'] = uncategorized;
  }

  return grouped;
}

function toggleCategory(category) {
  if (expandedCategories.has(category)) {
    expandedCategories.delete(category);
  } else {
    expandedCategories.add(category);
  }
  render();
}

function render() {
  if (items.length === 0) {
    listContainer.innerHTML = '<div class="empty">No items yet — add one to get started</div>';
    updateStats();
    return;
  }

  listContainer.innerHTML = '';
  const grouped = groupByCategory(items);

  Object.entries(grouped).forEach(([category, categoryItems]) => {
    // Category section
    const section = document.createElement('div');
    section.className = 'category-section';

    // Category header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.onclick = () => toggleCategory(category);

    const title = document.createElement('div');
    title.className = 'category-title';
    title.textContent = category;

    const rightSide = document.createElement('div');
    rightSide.className = 'category-right';

    const count = document.createElement('span');
    count.className = 'category-count';
    count.textContent = categoryItems.length;

    const arrow = document.createElement('span');
    arrow.className = 'category-arrow';
    if (expandedCategories.has(category)) {
      arrow.classList.add('expanded');
    }
    arrow.textContent = '▼';

    rightSide.appendChild(count);
    rightSide.appendChild(arrow);
    header.appendChild(title);
    header.appendChild(rightSide);

    // Category items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'category-items';
    if (expandedCategories.has(category)) {
      itemsContainer.classList.add('show');
    }

    // Render items
    categoryItems.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item' + (item.completed ? ' completed' : '');
      itemEl.draggable = true;
      itemEl.dataset.id = item.id;

      // Drag handle
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '⋮⋮';

      // Checkbox
      const checkbox = document.createElement('div');
      checkbox.className = 'checkbox' + (item.completed ? ' checked' : '');
      checkbox.onclick = () => toggleComplete(item.id);

      // Content
      const content = document.createElement('div');
      content.className = 'item-content';

      const text = document.createElement('div');
      text.className = 'item-text';
      text.textContent = item.text;

      content.appendChild(text);

      // Badges
      const badges = document.createElement('div');
      badges.className = 'item-badges';

      if (item.priority) {
        const priBadge = document.createElement('span');
        priBadge.className = `badge priority-${item.priority}`;
        priBadge.textContent = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);
        badges.appendChild(priBadge);
      }

      if (item.dueDate) {
        const dateBadge = document.createElement('span');
        dateBadge.className = 'badge badge-date';
        dateBadge.textContent = '📅 ' + formatDate(item.dueDate);
        badges.appendChild(dateBadge);
      }

      if (badges.children.length > 0) {
        content.appendChild(badges);
      }

      // Notes
      if (item.notes) {
        const notes = document.createElement('div');
        notes.className = 'item-notes';
        notes.id = `notes-${item.id}`;
        notes.textContent = item.notes;
        content.appendChild(notes);
      }

      // Actions
      const actions = document.createElement('div');
      actions.className = 'actions';

      if (item.notes) {
        const expandBtn = document.createElement('button');
        expandBtn.className = 'btn-icon btn-expand';
        expandBtn.textContent = '▼';
        expandBtn.onclick = () => toggleNotes(item.id, expandBtn);
        actions.appendChild(expandBtn);
      }

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-icon';
      editBtn.textContent = '✏';
      editBtn.onclick = () => editItem(item.id);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon btn-delete';
      delBtn.textContent = '×';
      delBtn.onclick = () => deleteItem(item.id);

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      // Drag events
      itemEl.addEventListener('dragstart', handleDragStart);
      itemEl.addEventListener('dragover', handleDragOver);
      itemEl.addEventListener('drop', handleDrop);
      itemEl.addEventListener('dragend', handleDragEnd);

      itemEl.appendChild(dragHandle);
      itemEl.appendChild(checkbox);
      itemEl.appendChild(content);
      itemEl.appendChild(actions);
      itemsContainer.appendChild(itemEl);
    });

    section.appendChild(header);
    section.appendChild(itemsContainer);
    listContainer.appendChild(section);
  });

  updateStats();
}

function toggleNotes(id, btn) {
  const notes = document.getElementById(`notes-${id}`);
  if (notes.classList.contains('show')) {
    notes.classList.remove('show');
    btn.textContent = '▼';
    btn.classList.remove('expanded');
  } else {
    notes.classList.add('show');
    btn.textContent = '▲';
    btn.classList.add('expanded');
  }
}

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  
  const categorySection = draggedItem.closest('.category-items');
  if (!categorySection) return false;
  
  const afterElement = getDragAfterElement(categorySection, e.clientY);
  if (afterElement == null) {
    categorySection.appendChild(draggedItem);
  } else {
    categorySection.insertBefore(draggedItem, afterElement);
  }
  
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  // Update items array order within the same category
  const categorySection = draggedItem.closest('.category-items');
  if (categorySection) {
    const categoryItems = categorySection.querySelectorAll('.item');
    const draggedId = draggedItem.dataset.id;
    const draggedItemData = items.find(i => i.id === draggedId);
    
    if (draggedItemData) {
      // Remove from current position
      items = items.filter(i => i.id !== draggedId);
      
      // Find new position
      let insertIndex = 0;
      categoryItems.forEach((el, idx) => {
        if (el.dataset.id === draggedId) {
          insertIndex = items.filter(i => i.category === draggedItemData.category).length;
          // Count how many items of same category come before
          let beforeCount = 0;
          for (let i = 0; i < idx; i++) {
            const beforeId = categoryItems[i].dataset.id;
            const beforeItem = items.find(it => it.id === beforeId);
            if (beforeItem && beforeItem.category === draggedItemData.category) {
              beforeCount++;
            }
          }
          insertIndex = beforeCount;
        }
      });
      
      // Find global insert position
      let globalIndex = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].category === draggedItemData.category) {
          if (insertIndex === 0) {
            globalIndex = i;
            break;
          }
          insertIndex--;
        }
        globalIndex = i + 1;
      }
      
      items.splice(globalIndex, 0, draggedItemData);
      save();
    }
  }
  
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  draggedItem = null;
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function toggleComplete(id) {
  const item = items.find(i => i.id === id);
  if (item) {
    item.completed = !item.completed;
    save();
    render();
  }
}

function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newText = prompt('Edit item:', item.text);
  if (newText !== null && newText.trim()) {
    item.text = newText.trim();
    save();
    render();
  }
}

function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  items = items.filter(i => i.id !== id);
  save();
  render();
}

function addItem() {
  const text = itemText.value.trim();
  if (!text) {
    itemText.focus();
    return;
  }

  const category = itemCategory.value || '';

  const newItem = {
    id: genId(),
    text: text,
    notes: itemNotes.value.trim(),
    category: category,
    priority: itemPriority.value,
    dueDate: itemDate.value,
    completed: false,
    created: new Date().toISOString()
  };

  items.unshift(newItem);
  
  // Auto-expand the category
  if (category) {
    expandedCategories.add(category);
  } else {
    expandedCategories.add('Uncategorized');
  }
  
  // Clear form
  itemText.value = '';
  itemNotes.value = '';
  itemCategory.value = '';
  itemPriority.value = '';
  itemDate.value = '';
  
  save();
  render();
  itemText.focus();
}

addBtn.addEventListener('click', addItem);
itemText.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addItem();
  }
});

async function init() {
  items = await load();
  render();
}

init();
