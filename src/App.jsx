import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateQuiz from "./pages/CreateQuiz";
import MyQuiz from "./pages/MyQuiz";
import Authentication from "./pages/Authentication";
import PlayQuiz from "./pages/PlayQuiz";
import ResultQuiz from "./pages/ResultQuiz";
import Home from './pages/Home';
import Navbar from "./components/Navbar";



function App() {

  
  
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
      <Route path="/my-quizzes" element={<MyQuiz />} />
      <Route path="/authentication" element={<Authentication />} />
      <Route path="/play-quiz" element={<PlayQuiz />} />
      <Route path="/result" element={<ResultQuiz />} />
    </Routes>
    </BrowserRouter>
  )
}
export default App;   