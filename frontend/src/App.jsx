import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/home.jsx";
import AddBook from "./pages/books/AddBook.jsx"
import ViewBook from "./pages/books/ViewBook.jsx"

document.body.style.overflowX = 'hidden'; 

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/books/create' element={<AddBook />} />
      <Route path='/books/:id' element={<ViewBook />} />
    </Routes>
  );
};

export default App;