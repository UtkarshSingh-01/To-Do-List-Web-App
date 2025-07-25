  let tasks = [];
  let currentTab = 'pending';
  let editTaskId = null;

  function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const filtered = tasks.filter(task =>
      currentTab === 'pending' ? !task.completed : task.completed
    );

    if (filtered.length === 0) {
      taskList.innerHTML = "<p style='color:#777;'>No tasks to show.</p>";
      return;
    }

    filtered.forEach(task => {
      const div = document.createElement('div');
      div.className = 'task' + (task.completed ? ' complete' : '');

      div.innerHTML = `
        <div>
          <strong>${task.title}</strong>
          <small>${new Date(task.createdAt).toLocaleString()}</small>
        </div>
        <div>
          ${task.description}
          ${task.completed ? `<small>Completed: ${new Date(task.completedAt).toLocaleString()}</small>` : ''}
        </div>
        <div>
          ${!task.completed ? `<button class="done" onclick="markComplete('${task.id}')">✔</button>` : ''}
          <button class="edit" onclick="editTask('${task.id}')">✎</button>
          <button onclick="deleteTask('${task.id}')">X</button>
        </div>
      `;
      taskList.appendChild(div);
    });
  }

  function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();

    if (title === '' || description === '') {
      alert("Please fill out both fields.");
      return;
    }

    if (editTaskId !== null) {
      const task = tasks.find(t => t.id === editTaskId);
      if (task) {
        task.title = title;
        task.description = description;
      }
      editTaskId = null;
    } else {
      tasks.push({
        id: crypto.randomUUID(),
        title,
        description,
        createdAt: Date.now(),
        completed: false,
        completedAt: null
      });
    }

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    renderTasks();
  }

  function markComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = true;
      task.completedAt = Date.now();
      renderTasks();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }

  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDescription').value = task.description;
      editTaskId = id;
    }
  }

  function switchTab(tab) {
    currentTab = tab;
    document.getElementById('pendingTab').classList.remove('active');
    document.getElementById('completedTab').classList.remove('active');
    document.getElementById(`${tab}Tab`).classList.add('active');
    renderTasks();
  }

  renderTasks();