import TaskCard from "../components/TaskCard";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Board() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

 const clearActivity = () => {
  setActivityLog([]);             
  localStorage.removeItem("activityLog"); 
};

  const [showForm, setShowForm] = useState(false);

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [activityLog, setActivityLog] = useState(() => {
    const storedLog = localStorage.getItem("activityLog");
    return storedLog ? JSON.parse(storedLog) : [];
  });

  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  const logAction = (action, taskTitle) => {
    setActivityLog(prev => [
      { action, taskTitle, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
  if (editingTask) {
    setNewTaskTitle(editingTask.title);
    setDescription(editingTask.description || "");
    setPriority(editingTask.priority);
    setDueDate(editingTask.dueDate || "");
    setTags(editingTask.tags ? editingTask.tags.join(", ") : "");
    setShowForm(true);
  }
}, [editingTask]);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const draggedTask = tasks.find(t => t.id === parseInt(draggableId));
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask, status: destination.droppableId };
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    logAction("Moved", updatedTask.title);
  };

  const filteredTasks = (status) =>
    tasks
      .filter((task) => task.status === status)
      .filter(
        (task) =>
          (priorityFilter === "All" || task.priority === priorityFilter) &&
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: darkMode ? "1px solid #555" : "1px solid #ccc",
  width: "100%",
  backgroundColor: darkMode ? "#2c2c2c" : "#fff",
  color: darkMode ? "#fff" : "#000"
};


  const buttonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: darkMode
          ? "#121212"
          : "linear-gradient(to right, #667eea, #764ba2)",
        color: darkMode ? "#f5f5f5" : "#000"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <h2
  style={{
    color: darkMode ? "#ffffff" : "#1c036ff3",
    letterSpacing: "1px"
  }}
>
  Task Management Board
</h2>


        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ ...buttonStyle, background: "#444", color: "#fff" }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            style={{ ...buttonStyle, background: "#e53935", color: "#fff" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "25px" }}>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              ...buttonStyle,
              background: "#4CAF50",
              color: "#fff",
              fontSize: "15px"
            }}
          >
            + Add Task
          </button>
        )}

        {(showForm || editingTask) && (
          <div
            style={{
              maxWidth: "500px",
              padding: "20px",
              borderRadius: "12px",
              background: darkMode ? "#1e1e1e" : "#ffffff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              marginTop: "15px"
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Create New Task</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Task Title *"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={inputStyle}
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={inputStyle}
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={inputStyle}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={inputStyle}
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  style={{ ...buttonStyle, background: "#4CAF50", color: "#fff" }}
                  onClick={() => {
  if (!newTaskTitle.trim()) return;

  if (editingTask) {
    const updatedTasks = tasks.map((t) =>
      t.id === editingTask.id
        ? {
            ...t,
            title: newTaskTitle,
            description,
            priority,
            dueDate,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
          }
        : t
    );

    setTasks(updatedTasks);
    logAction("Updated", newTaskTitle);
    setEditingTask(null);

  } else {
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description,
      priority,
      dueDate,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      createdAt: new Date().toISOString(),
      status: "todo"
    };

    setTasks([...tasks, newTask]);
    logAction("Created", newTask.title);
  }

  setNewTaskTitle("");
  setDescription("");
  setPriority("Low");
  setDueDate("");
  setTags("");
  setShowForm(false);
}}

                >
                  Save
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  style={{ ...buttonStyle, background: "#ccc" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {["todo", "doing", "done"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    minHeight: "400px",
                    background: darkMode ? "#2c2c2c" : "#f4f4f4",
                    padding: "15px",
                    borderRadius: "10px"
                  }}
                >
                  <h3 style={{ textTransform: "capitalize", marginBottom: "15px" }}>
                    {status}
                  </h3>

                  {filteredTasks(status).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: "10px",
                            ...provided.draggableProps.style
                          }}
                        >
                          <TaskCard
                            task={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            setEditingTask={setEditingTask}
                            logAction={logAction}
                            darkMode={darkMode}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <div
        style={{
          marginTop: "40px",
          paddingTop: "15px",
          borderTop: "1px solid #aaa"
        }}
      >
        <h3>Activity Log</h3>

        {activityLog.length === 0 ? (
          <p>No actions yet.</p>
        ) : (
          <ul>
            {activityLog.map((log, i) => (
              <li key={i} style={{ fontSize: "14px", marginBottom: "5px" }}>
                [{log.timestamp}] {log.action} - {log.taskTitle}
              </li>
            ))}
          </ul>
        )}

      </div>
      <button onClick={clearActivity}>
  Clear Activity
</button>
    </div>
  );
}

export default Board;
