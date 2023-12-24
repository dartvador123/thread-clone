import Feed from "./Pages/feed"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "../functions/myFun/src/Context/AuthContext"
import Login from "./Pages/login"
import Profiles from "./Pages/profiles"
import ThreadPage from "./Components/ThreadPage"
import Signup from "./Pages/Signup"



function App() {

  return (
    <div>
    <Router>
      <AuthProvider >
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/login/signup' element={<Signup/>}/>
      <Route path='/' element={<Feed/>}/> 
      <Route path="/profile/:username" element={<Profiles/>}/> 
      <Route path="/thread/:id" element={<ThreadPage/>}/>
    </Routes>
    </AuthProvider>
    </Router>
    </div>
  )
}

export default App
