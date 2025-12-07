import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from "react-router-dom";
import {Header} from "./Components/Header.jsx";
import Footer from "./Components/Footer";

function App() {
  const [count, setCount] = useState(0)

  return (
        <>
        <Header/>
        <main className="flex flex-col flex-1">
            <Outlet/>
        </main>
        <Footer/>
        </>
    )
}

export default App
