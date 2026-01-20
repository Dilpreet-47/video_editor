import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Demo from "./components/Demo.jsx";
const App = () => {
    return (
      <div>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/demo" element={<Demo />} />
            </Routes>
      </div>
    );
};
export default App;