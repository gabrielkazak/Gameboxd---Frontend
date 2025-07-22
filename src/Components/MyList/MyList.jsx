import React, { useState, useEffect } from 'react'
import Header from '../Header/Header';
import GamesGrid from '../GamesGrid/GamesGrid';
import { useNavigate } from 'react-router-dom';
import './MyList.css'


const MyList = () => {

  const apiUrl = import.meta.env.VITE_API_RAW;
  const apiKey = import.meta.env.VITE_API_KEY;

  const navigate = useNavigate()

  const [gameIds, setGameIds] = useState([]);
  const [games, setGames] = useState([])
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

  useEffect(() => {
    const handleUserGames = async () => {
      try {
        const response = await fetch(`/api/gamesList/${id}`, {
          'headers': {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json()
        setGameIds(data.games.games)
        console.log(data.games.games)
      } catch (error) {
        alert('Erro ao carregar jogos', error)
      }
    }
    if (id && token) {
      handleUserGames();
    }
  }, [id, token]);

  
  useEffect(() => {
  const handleFetchUserGames = async () => {
    try {
      setLoading(true);

      const requests = gameIds.map(game =>
        fetch(`${apiUrl}/${game.gameId}?key=${apiKey}`).then(res => res.json())
      );

      const results = await Promise.all(requests);

      setGames(results);
      setLoading(false);
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  if (Array.isArray(gameIds) && gameIds.length > 0) {
    handleFetchUserGames();
  }
}, [gameIds, apiUrl, apiKey]);


  

 return (
  <>
    <Header userName={name} />
    <p className='grid-title display-5 mx-5'>Sua Lista de Jogos</p>

    {
      loading || !Array.isArray(games) || games.length === 0 ? (
        <p>Carregando jogos...</p>
      ) : (
        <GamesGrid
          games={games}
          loading={loading}
          error={error}
          token={token}
          userId={id}
          myGames={gameIds}
          listGames = {true}
        />
      )
    }

    <div className='fade-bottom'></div>
  </>
);

}

export default MyList