import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import GamesGrid from '../GamesGrid/GamesGrid'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [games, setGames] = useState([]);
  const [moreGames, setMoreGames] = useState([])
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [genero, setGenero] = useState('');


  const apiUrl = import.meta.env.VITE_API_GAMES;

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedId = localStorage.getItem('id');
    const storedAccessToken = localStorage.getItem('token');

    if (storedName && storedId && storedAccessToken) {
      setName(storedName);
      setId(storedId);
      setToken(storedAccessToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const past = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const response = await fetch(`${apiUrl}&dates=${past},${today}&ordering=-added&page_size=32`);
        const data = await response.json();
        setGames(data.results);
        const moreResponse = await fetch(`${apiUrl}&page=1&ordering=-added,-rating&page_size=32`);
        const moreData = await moreResponse.json();
        setMoreGames(moreData.results);
        console.log(data.results)
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchGames();
  }, [apiUrl]);

  useEffect(() => {
    const fetchMoreGames = async () => {
      if (page === 1) return;
      setLoadingMore(true);
      setError(false);
      try {
        const response = await fetch(`${apiUrl}&page=${page}&ordering=-added,-rating&page_size=32`);
        const data = await response.json();
        setMoreGames((prevGames) => [...prevGames, ...data.results]);
      } catch (err) {
        console.error(err);
        setError(true);
      }
      setLoadingMore(false);
    };

    fetchMoreGames();
  }, [page, apiUrl]);

    
  
   useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !loadingMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
   }, [loadingMore]);
  
  useEffect(() => {
    const handleGenre = async () => {
      if (!genero) return;
      try {
        const response = await fetch(`${apiUrl}&genres=${genero}&page_size=40`);
        const result = await response.json()
        navigate('/genre', { state: { genero, results: result.results } })
      }catch (error) {
        console.log(error)
      }
    }
    handleGenre()
  }, [genero, apiUrl, navigate])
  


  return (
    <>
      <Header userName={name} />
      <div className='title-container d-flex justify-content-between align-items-center'>
        <p className='grid-title display-5 mx-5 my-0'>Jogos Novos e Populares</p>
        <select  onChange={(e) => setGenero(e.target.value)} className='select' name="" id="">
          <option value="">Selecione uma categoria</option>
          <option value="arcade">Arcade</option>
          <option value="adventure">Aventura</option>
          <option value="action">Ação</option>
          <option value="card">Cartas</option>
          <option value="casual">Casual</option>
          <option value="racing">Corrida</option>
          <option value="educational">Educacional</option>
          <option value="sports">Esportes</option>
          <option value="strategy">Estratégia</option>
          <option value="family">Família</option>
          <option value="indie">Indie</option>
          <option value="fighting">Luta</option>
          <option value="massively-multiplayer">Multiplayer Massivo</option>
          <option value="platformer">Plataforma</option>
          <option value="puzzle">Puzzle</option>
          <option value="role-playing-games-rpg">RPG</option>
          <option value="simulation">Simulação</option>
          <option value="shooter">Shooter</option>
          <option value="board-games">Tabuleiro</option>
        </select>
      </div>
      <GamesGrid
        games={games}
        loading={loading}
        error={error}
        token={token}
        userId={id}
      />
      
      {moreGames && 
        <>
        
          <p className='grid-title display-5 mx-5'>Jogos Populares Historicamente</p>
          
          <GamesGrid
            games={moreGames}
            loading={loading}
            error={error}
            token={token}
            userId={id}
          />
        </>
      }
      <div className='fade-bottom'></div>
    </>
  );
};

export default Dashboard;
