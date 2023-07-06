import IndexPage from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RedirectPage from './pages/redirect';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path={'rips/*'} element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
