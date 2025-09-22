import React from "react";
import Navbar from "./components/Navbar.jsx";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main Todo App */}
      <TodoList />
    </div>
  );
}

export default App;
