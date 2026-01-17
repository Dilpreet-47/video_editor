import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
const App = () => {
    return (
      <div>

            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
      </div>
    );
};
export default App;