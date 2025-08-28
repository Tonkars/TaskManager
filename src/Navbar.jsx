function Navbar({ selectedTab, onTabChange, isLoggedIn, onLogout }) {
  const tabs = isLoggedIn
    ? ["Home", "Tasks", "Logout"]
    : ["Home", "Tasks", "Login", "Register"];

  return (
    <nav
      style={{
        position: "relative",
        left: 0,
        right: 0,
        width: "100vw", // Use viewport width for true edge-to-edge
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        background: "#171863ff",
        color: "white",
        boxSizing: "border-box",
        zIndex: 1000,
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Sfakianakis Task Manager</h2>
      <ul
        style={{
          display: "flex",
          gap: "24px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              onClick={() => (tab === "Logout" ? onLogout() : onTabChange(tab))}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                textDecoration: selectedTab === tab ? "underline" : "none",
                cursor: "pointer",
                fontWeight: selectedTab === tab ? "bold" : "normal",
                fontSize: "1rem",
              }}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
