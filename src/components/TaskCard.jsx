function TaskCard({
  task,
  tasks,
  setTasks,
  setEditingTask,
  logAction,
  darkMode = false
}) {

  const deleteTask = () => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
    logAction && logAction("Deleted", task.title);
  };

  const handleEditClick = () => {
    setEditingTask(task);
    logAction && logAction("Editing started", task.title);
  };

  const priorityColors = {
    High: "#ff4d4f",
    Medium: "#faad14",
    Low: "#52c41a"
  };

  return (
    <div
      style={{
        background: darkMode ? "#4a4949" : "#ffffff",
        color: darkMode ? "#f5f5f5" : "#000",
        padding: "14px",
        borderRadius: "10px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
  
      <div style={{ fontWeight: "600", fontSize: "15px" }}>
        {task.title}
      </div>

      {task.description && (
        <div style={{ fontSize: "13px", opacity: 0.8 }}>
          {task.description}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "20px",
            background: priorityColors[task.priority],
            color: "white",
            fontWeight: "500"
          }}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span style={{ opacity: 0.8 }}>
            📅 {task.dueDate}
          </span>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap"
          }}
        >
          {task.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                background: darkMode ? "#444" : "#e6f7ff",
                padding: "3px 8px",
                borderRadius: "20px",
                fontSize: "11px"
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button
          onClick={handleEditClick}
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: "6px",
            border: "none",
            background: "#1890ff",
            color: "white",
            cursor: "pointer"
          }}
        >
          Edit
        </button>

        <button
          onClick={deleteTask}
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: "6px",
            border: "none",
            background: "#ff4d4f",
            color: "white",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
