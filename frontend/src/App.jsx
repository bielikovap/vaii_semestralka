import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/home.jsx";
import AddBook from "./pages/books/AddBook.jsx"
import ViewBook from "./pages/books/ViewBook.jsx"
import ViewAuthor from './pages/author/ViewAuthor.jsx';
import ViewAllBooks from './pages/books/ViewAllBooks.jsx';
import ViewAllAuthors from './pages/author/ViewAllAuthors.jsx'
import EditAuthor from './pages/author/EditAuthor.jsx';
import AddAuthor from './pages/author/AddAuthor.jsx';
import Login from './components/Login.jsx';
import ViewAccount from './pages/users/ViewUser.jsx';

document.body.style.overflowX = 'hidden'; 

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/add-book' element={<AddBook />} />
      <Route path='/books/:id' element={<ViewBook />} />
      <Route path='/books' element={<ViewAllBooks />} />

      <Route path="/authors/:authorId" element={<ViewAuthor />} />
      <Route path="/authors" element={<ViewAllAuthors />} />
      <Route path="/edit-author/:id" element={<EditAuthor />}/>
      <Route path="/add-author" element={<AddAuthor />}/>
      <Route path="/login" element={<Login />} /> 
      <Route path="/users/:userId" element={<ViewAccount />} />
      
    </Routes>
  );
};

export default App;