import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar.jsx";
import TodoList from "./components/TodoList.jsx";
import "./App.css";

// Using arrow function with ES6
const App = () => {
  return (
    <ThemeProvider>
      <div className="App min-h-screen">
        {/* Fixed Navbar at the top */}
        <Navbar />

        {/* Main content with padding to account for fixed navbar */}
        <div className="pt-16">
          <TodoList />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;