import { Route } from "react-router-dom"
import Home from "./Pages/Home"
import Chat from "./Pages/Chat"
import "./App.css"

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chat} />
    </div>
  )
}

export default App
