import {Route, BrowserRouter, Navigate, Routes} from "react-router-dom"
import {useSelector} from "react-redux";
import Login from "./pages/Login"
import Chat from "./pages/Chat"
function App() {
  const token=useSelector((state)=>state.token);
  
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/chat" element={token?<Chat/>:<Navigate to={"/"}/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
