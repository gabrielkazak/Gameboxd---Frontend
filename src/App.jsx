import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from './Components/LoginPage/LoginPage';
import Dashboard from './Components/Dashboard/Dashboard';
import SearchPage from './Components/SearchPage/SearchPage';
import MyList from './Components/MyList/MyList';
import Wishlist from './Components/Wishlist/Wishlist';
import GenrePage from './Components/GenrePage/GenrePage';
import GamePage from './Components/GamePage/GamePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/my-list' element={<MyList />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/genre' element={<GenrePage />} />
        <Route path='/game/:id' element={<GamePage />} />
      </Routes>
    </Router>
  )
}

export default App