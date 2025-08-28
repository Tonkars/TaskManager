import { useState } from "react";
import Navbar from "./Navbar";

function App() {
  const [users, setUsers] = useState([
    { username: "yourusername", password: "yourpassword" },
    { username: "friend", password: "friendpassword" },
  ]);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(""); // Track logged-in user
  const [loginError, setLoginError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [tasks, setTasks] = useState({}); // Per-user tasks

  // Add this state for category selection on Home
  const allCategories = ["General", "Work", "Personal", "Urgent"];
  const [homeCategory, setHomeCategory] = useState("General");

  function handleLogin(username, password) {
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setIsLoggedIn(true);
      setCurrentUser(username);
      setSelectedTab("Home");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials");
    }
  }

  function handleRegister(username, password) {
    if (users.find((u) => u.username === username)) {
      return "Username already exists";
    }
    setUsers([...users, { username, password }]);
    setSelectedTab("Login");
    return "";
  }

  function handleLogout() {
    setShowLogoutConfirm(true);
    setSelectedTab("Logout");
  }

  function confirmLogout() {
    setIsLoggedIn(false);
    setCurrentUser("");
    setSelectedTab("Login");
    setShowLogoutConfirm(false);
  }

  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  // Helper to update tasks for the current user
  function updateUserTasks(newTasks) {
    setTasks({ ...tasks, [currentUser]: newTasks });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, padding: "20px" }}>
        {selectedTab === "Home" && (
          <>
            <h1>Home</h1>
            <p>Welcome to Sfakianakis' Task Manager</p>
            {isLoggedIn && <p>You are logged in as <b>{currentUser}</b>!</p>}
            <div style={{ margin: "20px 0" }}>
              <label>
                <b>Show tasks for category: </b>
                <select
                  value={homeCategory}
                  onChange={e => setHomeCategory(e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  {allCategories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            </div>
            <ul>
              {Object.entries(tasks).flatMap(([user, userTasks]) =>
                userTasks
                  .filter(task => task.category === homeCategory)
                  .map(task => (
                    <li
                      key={task.id}
                      style={{
                        margin: "10px 0",
                        border: "1px solid #444",
                        padding: "10px",
                        borderRadius: "6px",
                        background: "#2d313a" // Slightly lighter dark for cards
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <strong>{task.title}</strong>
                          <span style={{ marginLeft: 10, fontSize: "0.9em", color: "#555" }}>
                            [{task.category}]
                          </span>
                          <span style={{ marginLeft: 16, fontSize: "0.9em", color: "#555" }}>
                            by <b>{user}</b>
                          </span>
                        </div>
                        <ProgressBar status={task.status} />
                      </div>
                      <ul>
                        {task.comments.map((c, i) => (
                          <li key={i} style={{ fontSize: "0.95em" }}>
                            💬 {c}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))
              )}
            </ul>
          </>
        )}
        {selectedTab === "Tasks" && (
          <TasksPage
            tasks={tasks[currentUser] || []}
            setTasks={updateUserTasks}
            isLoggedIn={isLoggedIn}
          />
        )}
        {selectedTab === "Login" && (
          <>
            <h1>Login</h1>
            <LoginForm onLogin={handleLogin} error={loginError} />
          </>
        )}
        {selectedTab === "Register" && (
          <>
            <h1>Register</h1>
            <RegisterForm onRegister={handleRegister} />
          </>
        )}
        {selectedTab === "Logout" && showLogoutConfirm && (
          <>
            <h1>Logout</h1>
            <p>Are you sure you want to log out?</p>
            <button onClick={confirmLogout}>Yes, log out</button>
            <button onClick={cancelLogout} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(username, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Log In</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const err = onRegister(username, password);
    if (err) setError(err);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Register</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

function TasksPage({ tasks, setTasks, isLoggedIn }) {
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("General");
  const [commentInputs, setCommentInputs] = useState({});
  const categories = ["General", "Work", "Personal", "Urgent"];

  function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        comments: [],
        status: "Not Started",
        category,
      },
    ]);
    setNewTask("");
    setCategory("General");
  }

  function addComment(taskId, comment) {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, comment] }
          : task
      )
    );
    setCommentInputs({ ...commentInputs, [taskId]: "" });
  }

  function changeStatus(taskId, status) {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  }

  if (!isLoggedIn) return <p>Please log in to view your tasks.</p>;

  return (
    <div>
      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          required
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              margin: "20px 0",
              border: "1px solid #444",
              padding: "10px",
              borderRadius: "6px",
              background: "#2d313a" // Slightly lighter dark for cards
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{task.title}</strong>
                <span style={{ marginLeft: 10, fontSize: "0.9em", color: "#888" }}>
                  [{task.category}]
                </span>
              </div>
              <select
                value={task.status}
                onChange={(e) => changeStatus(task.id, e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <ProgressBar status={task.status} />
            </div>
            <div>
              <ul>
                {task.comments.map((c, i) => (
                  <li key={i} style={{ fontSize: "0.95em" }}>
                    💬 {c}
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addComment(task.id, commentInputs[task.id] || "");
                }}
                style={{ marginTop: "8px" }}
              >
                <input
                  value={commentInputs[task.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [task.id]: e.target.value })
                  }
                  placeholder="Add comment"
                  required
                />
                <button type="submit">Comment</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Progress bar component
function ProgressBar({ status }) {
  let percent = 0;
  if (status === "In Progress") percent = 50;
  if (status === "Completed") percent = 100;
  return (
    <div style={{ width: 120, marginLeft: 10 }}>
      <div
        style={{
          height: 8,
          background: "#eee",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: percent === 100 ? "#4caf50" : "#2196f3",
            transition: "width 0.3s",
          }}
        />
      </div>
      <div style={{ fontSize: "0.8em", textAlign: "center" }}>{status}</div>
    </div>
  );
}

export default App;
