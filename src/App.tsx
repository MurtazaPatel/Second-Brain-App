import { BrowserRouter, Route,Routes } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import DashBoard from "./pages/Dashboard"
import { SharedPage } from "./pages/SharedPage"

export default function App() {
  return (<BrowserRouter>
  <Routes>
    <Route path="/signup" element={<Signup/>} />
    <Route path="/signin" element={<Signin/>} />
    <Route path="/home" element={<DashBoard/>} />
    <Route path="/shared" element={<SharedPage/>} />
  </Routes>
  </BrowserRouter>)
}


