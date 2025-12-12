import { Routes, Route } from 'react-router-dom';
import AddItems from './components/AddItems';
import List from './components/List';
import NavBar from './components/NavBar';
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<AddItems />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </>
  );
}

export default App;
