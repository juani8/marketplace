import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from '@pages/MainPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;