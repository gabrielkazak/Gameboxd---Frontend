import React, { useState } from 'react'
import personIcon from '../../assets/person.png'
import { useNavigate } from 'react-router-dom'
import './Header.css'

const Header = ({ userName }) => {

  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_RAW;
  const apiKey = import.meta.env.VITE_API_KEY;

  const [search, setSearch] = useState('')

  const handleSearch = async () => {
    try {
      const response = await fetch(`${apiUrl}?search=${search}&key=${apiKey}`);
      const result = await response.json()
      navigate('/search', { state: { search, results: result.results } });
    } catch (error) {
      console.log(error)
    }
  }

  const handleReturnMenu = () => {
    window.location.href = '/dashboard'
  }
  
  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('token')
    window.location.href = '/'
  }

return (
  <div>
    <div className="header d-flex align-items-center justify-content-between">
      <div className="title fs-1 d-flex align-items-center" style={{ height: '100%' }} onClick={()=> handleReturnMenu()}>Gameboxd</div>
      <div className="input-search d-flex align-items-center" style={{ height: '100%' }}>
        <input className="search-bar" placeholder="Procure os mais variados jogos" type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e)=>{if(e.key === 'Enter'){handleSearch()}}} />
        <button className='btn btn-search' onClick={async () => handleSearch()}>Procurar</button>
      </div>
      <div className="user-field d-flex align-items-center justify-content-between" style={{ height: '100%', position: 'relative' }}>
        <img className="icon" src={personIcon} alt="" />
        <p className="username mb-0 ms-2">Olá {userName}</p>
        <div className="menu-icon" onClick={() => { setMenuOpen(!menuOpen); }}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
        {menuOpen &&
          <div className={`dropdown-menu`}>
            <button onClick={() => { navigate('/my-list'); setMenuOpen(false); }} className="dropdown-item">Minha Lista</button>
            <button onClick={() => { navigate('/wishlist'); setMenuOpen(false); }} className="dropdown-item">Wishlist</button>
            <button onClick={handleLogout} className="dropdown-item btn logout">Logout</button>
          </div>
        }
      </div>
    </div>
  </div>
)
}

export default Header