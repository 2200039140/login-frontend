// FRONTEND: App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    course: "",
    grade: "",
  });
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const signup = async () => {
    try {
      await axios.post("http://login-backend-production-4d46.up.railway.app/signup", form);
      alert("Signup successful! Please login.");
      setPage("login");
    } catch {
      alert("Error: Email already exists.");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post("http://login-backend-production-4d46.up.railway.app/login", {
        email: form.email,
        password: form.password,
      });
      setToken(res.data.token);
      setRole(res.data.role);
      setPage("profile");
      loadProfile(res.data.token);
    } catch {
      alert("Invalid credentials.");
    }
  };

  const loadProfile = async (tk) => {
    const res = await axios.get("http://login-backend-production-4d46.up.railway.app/profile", {
      headers: { Authorization: tk },
    });
    setProfile(res.data);
  };

  if (page === "signup")
    return (
      <div className="container">
        <h2>Signup</h2>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <select name="role" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "student" && (
          <>
            <input name="course" placeholder="Course" onChange={handleChange} />
            <input name="grade" placeholder="Grade" onChange={handleChange} />
          </>
        )}
        <button onClick={signup}>Register</button>
        <p>
          Already have account?{" "}
          <a href="#" onClick={() => setPage("login")}>
            Login
          </a>
        </p>
      </div>
    );

  if (page === "login")
    return (
      <div className="container">
        <h2>Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button onClick={login}>Login</button>
        <p>
          No account?{" "}
          <a href="#" onClick={() => setPage("signup")}>
            Signup
          </a>
        </p>
      </div>
    );

  if (page === "profile")
    return (
      <div className="container">
        <h2>Welcome {role.toUpperCase()}</h2>
        <button
          onClick={() => {
            setPage("login");
            setProfile(null);
          }}
        >
          Logout
        </button>
        <h3>Profile Data</h3>
        {role === "admin" &&
          profile &&
          profile.map((u, i) => (
            <div key={i} className="card">
              <b>{u.name}</b> ({u.email}) - {u.course} {u.grade}
            </div>
          ))}
        {role === "student" && profile && (
          <div className="card">
            <b>{profile.name}</b> ({profile.email}) <br />
            Course: {profile.course} | Grade: {profile.grade}
          </div>
        )}
      </div>
    );
}

export default App;
