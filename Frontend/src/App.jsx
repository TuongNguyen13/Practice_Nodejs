import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import { Login } from './Login/login.jsx' 
import { Register } from './Register/register.jsx'
import { Note } from './Note/note.jsx'
import { useParams } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Note />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
