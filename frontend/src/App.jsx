import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/home.jsx";
import AddBook from "./pages/books/AddBook.jsx"
import ViewBook from "./pages/books/ViewBook.jsx"
import ViewAuthor from './pages/author/ViewAuthor.jsx';
import ViewAllBooks from './pages/books/ViewAllBooks.jsx';

document.body.style.overflowX = 'hidden'; 

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/add-book' element={<AddBook />} />
      <Route path='/books/:id' element={<ViewBook />} />
      <Route path='/books' element={<ViewAllBooks />} />

      <Route path="/authors/:authorId" element={<ViewAuthor />} />
    </Routes>
  );
};

export default App;