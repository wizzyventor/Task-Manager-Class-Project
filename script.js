// Task Class Definition
class Task {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.completed = false;
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
    }
}

// Storage Array
let tasks = [];
let currentFilter = 'all';

// Add Task Function
function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        titleInput.style.borderColor = '#ef4444';
        setTimeout(() => {
            titleInput.style.borderColor = '#e0e0e0';
        }, 2000);
        return;
    }

    const newTask = new Task(title, description);
    tasks.push(newTask);

    // Clear inputs
    titleInput.value = '';
    descriptionInput.value = '';

    renderTasks();
}

// Toggle Complete Status
function toggleComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// Delete Task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
}

// Set Filter
function setFilter(filter) {
    currentFilter = filter;

    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTasks();
}

// Get Filtered Tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// Update Statistics
function updateStats() {
    document.getElementById('totalCount').textContent = tasks.length;
    document.getElementById('pendingCount').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completedCount').textContent = tasks.filter(t => t.completed).length;
}

// Render Tasks Function
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const filteredTasks = getFilteredTasks();

    // Clear container
    container.innerHTML = '';

    // Update stats
    updateStats();

    // Empty state
    if (filteredTasks.length === 0) {
        const emptyMessage = currentFilter === 'all' ?
            'No tasks yet. Add your first task above!' :
            `No ${currentFilter} tasks found.`;

        container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <div class="empty-state-text">${emptyMessage}</div>
                    </div>
                `;
        return;
    }

    // Render task cards
    filteredTasks.forEach(task => {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'completed' : ''}`;

        card.innerHTML = `
                    <div class="task-header">
                        <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    </div>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                    <div class="task-actions">
                        <button class="btn-done" onclick="toggleComplete('${task.id}')">
                            ${task.completed ? '✓ Done' : 'Mark Done'}
                        </button>
                        <button class="btn-delete" onclick="deleteTask('${task.id}')">
                            🗑 Delete
                        </button>
                    </div>
                `;

        container.appendChild(card);
    });
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to add task
document.getElementById('taskTitle').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();