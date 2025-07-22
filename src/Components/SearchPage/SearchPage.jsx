import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import GamesGrid from '../GamesGrid/GamesGrid';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.css'

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { search, results } = location.state || { search: '', results: [] };

  console.log(results)

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedId = localStorage.getItem('id');
    const storedAccessToken = localStorage.getItem('token');

    if (storedName && storedId && storedAccessToken) {
      setName(storedName);
      setId(storedId);
      setToken(storedAccessToken);
      setLoading(false);
    } else {
      setError(true)
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Header userName={name} />
      <p className='grid-title display-5 mx-5'>Resultados de {search}</p>
      
      <GamesGrid
        games={results}
        loading={loading}
        error={error}
        token={token}
        userId={id}
      />

      <div className='fade-bottom'></div>
    </>
  );
};

export default SearchPage;
