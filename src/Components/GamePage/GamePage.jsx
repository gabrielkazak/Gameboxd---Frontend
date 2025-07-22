import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { useParams, useNavigate } from 'react-router-dom';
import trophy from '../../assets/trophy.png'
import playIcon from '../../assets/playstation.png'
import xboxIcon from '../../assets/xbox.png'
import pcIcon from '../../assets/pc.png'
import nintendoIcon from '../../assets/nintendo.png'
import segaIcon from '../../assets/sega.png'
import appleIcon from '../../assets/apple.png'
import linuxIcon from '../../assets/linux.png'
import androidIcon from '../../assets/android.png'
import iphoneIcon from '../../assets/iphone.png'
import AddList from '../AddList/AddList';
import './GamePage.css'

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_RAW;
  const apiKey = import.meta.env.VITE_API_KEY;
  const [game, setGame] = useState(null);
  const [name, setName] = useState('');
  const [userId, setId] = useState('');
  const [token, setToken] = useState('');
  const [screenshoots, setScreenshots] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [wishlistText, setWishlistText] = useState('Adicione a Wishlist');
  const [addText, setAddText] = useState('Adicione a sua lista');
  const [showAddList, setShowAddList] = useState(false);


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
    const handleFetchGame = async () => {
      if (!id) return
      try {
        const response = await fetch(`${apiUrl}/${id}?key=${apiKey}`);
        const data = await response.json();
        setGame(data)
        setPlatforms(data.platforms);
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    handleFetchGame()
  }, [id, apiUrl, apiKey])

  useEffect(() => {
    const fetchScreenshots = async () => {
      const res = await fetch(`${apiUrl}/${id}/screenshots?key=${apiKey}`);
      const data = await res.json();
      setScreenshots(data.results);
      console.log(data.results)
    };

    if (game) {
      fetchScreenshots();
    }
  }, [game, apiKey, apiUrl, id]);

  const getPlatformIcons = () => {
      const icons = [];
  
      if (!platforms || !Array.isArray(platforms)) return icons;
  
      let playstationCounter = 0;
      let xboxCounter = 0;
      let pcCounter = 0;
      let nintendoCounter = 0;
      let segaCounter = 0;
      let appleCounter = 0;
      let linuxCounter = 0;
      let androidCounter = 0;
      let iphoneCounter = 0;
  
      platforms.forEach(p => {
        const name = p.platform.name.toLowerCase();

        function capitalizeWords(str) {
          return str
            .split(' ') // separa a string por espaço
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitaliza a primeira letra de cada palavra
            .join(' '); // junta novamente com espaço
        }
  
        if (name.includes('playstation') && playstationCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`ps-${name}`} src={playIcon} alt="PlayStation" className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          playstationCounter++;
        }
  
        if (name.includes('xbox') && xboxCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`xbox-${name}`} src={xboxIcon} alt="Xbox" className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          xboxCounter++;
        }
  
        if (name.includes('pc') && pcCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`pc-${name}`} src={pcIcon} alt="PC" className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          pcCounter++;
        }
  
        if (name.includes('mac') && appleCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`apple-${name}`} src={appleIcon} alt="apple" className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          appleCounter++;
        }
  
        if (name.includes('linux') && linuxCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`linux-${name}`} src={linuxIcon} alt="linux" className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          linuxCounter++;
        }
  
        if (name.includes('android') && androidCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`android-${name}`} src={androidIcon} alt="android" className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          androidCounter++;
        }
  
        if (name.includes('ios') && iphoneCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`iphone-${name}`} src={iphoneIcon} alt="iphone" className='iphone-icon' /> <p>{capitalizeWords(name)}</p></div>);
          iphoneCounter++;
        }
  
        if ((name.includes('nintendo') || name.includes('nes') || name.includes('wii')) && nintendoCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`nintendo-${name}`} src={nintendoIcon} alt='Nintendo' className='platform-icon' /> <p>{capitalizeWords(name)}</p></div>);
          nintendoCounter++;
        }
  
        if (name.includes('sega') && segaCounter == 0) {
          icons.push(<div className='d-flex gap-2'><img key={`sega-${name}`} src={segaIcon} alt='sega' className='sega-icon' /> <p>{capitalizeWords(name)}</p></div>)
          segaCounter++;
        }
      });
  
      return icons;
    };

  const addToWishlist = async () => {
    if (!userId || !token) return
    
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({name: game.name, userId: parseInt(userId), gameId: parseInt(id)})
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }
      setWishlistText('Adicionado ✓')
    } catch (error) {
      setWishlistText('Falha ao adicionar X')
      console.error(error)
    }
  }

  
  return (
    <>
      <Header userName={name} />
      <div className='main-content d-flex'>
  {game && (
    <>
      <div className="left-container p-4">
        <img className='image-gamePage mb-3' src={game.background_image} alt={game.name} />
        <h2 className='game-name fs-1'>{game.name}</h2>
        
        <div className='bottom-main d-flex flex-column gap-3 w-75'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex flex-column align-items-center'>
              <p className='text-secondary mb-1'>Troféus:</p>
              <div className='d-flex align-items-center gap-2 my-0'>
                <img className='platform-icon' src={trophy} alt="Troféu" />
                <span>{game.achievements_count}</span>   
              </div>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <p className='text-secondary mb-1'>Lançamento:</p>
              <p>{new Date(game.released).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <p className='text-secondary mb-1'>Nota:</p>
              <p>{game.rating}★</p>
            </div>
          </div>

          <div className='d-flex justify-content-between'>
            <div className='d-flex flex-column align-items-center'>
              <p className='text-secondary mb-1'>Desenvolvedora</p>
              <p>{game.developers?.[0]?.name}</p>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <p className='text-secondary mb-1'>Gêneros:</p>
              <div className='d-flex gap-3'>
              {game.genres && game.genres.map(genre => (
                <p className='info-box' key={genre.name}>{genre.name}</p>
              ))}
              </div>
            </div>
            <div className='d-flex flex-column align-items-center'>
              <p className='text-secondary mb-1'>Publisher</p>
              <p>{game.publishers?.[0]?.name}</p>
            </div>
          </div>
          <div className='d-flex flex-column align-items-center gap-1'>
            <p className='text-secondary'>Plataformas:</p>
            <div className="platforms d-flex my-0 gap-3">{getPlatformIcons()}</div>
          </div>
          <div className='d-flex align-items-center justify-content-between'>
            <button onClick={() => { setShowAddList(true); setAddText('Adicionado a lista'); }} className='add-list btn '>{addText}</button>
            <button onClick={addToWishlist} className='add-list btn wishlist-btn'>{wishlistText}</button>
          </div> 
                

          <div className='game-description mt-3'>
            <p className='text-secondary'>Sobre:</p>
            <p dangerouslySetInnerHTML={{ __html: game.description }} />
          </div>
          <div className='game-tags'>
            <p className='text-secondary mb-1'>Tags:</p>
              <div className='d-flex flex-wrap'>
              {game.tags && game.tags.map(tag => (
                <p className='text-secondary mx-1 my-0' key={tag.name}>{tag.name},</p>
              ))}
              </div>
          </div>
        </div>
      </div>

      <div className="right-container">
        <div className="screenshots-grid mt-3">
          {screenshoots && screenshoots.map((screenshot, index) => (
            <img
              key={index}
              src={screenshot.image}
              alt={`Screenshot ${index + 1}`}
              className='screenshot-img'
            />
          ))}
        </div>
      </div>
        </>
      )}
    </div>
 {showAddList && (
      <AddList
        gameId={id}
        name={game.name}
        userId={userId}
        token={token}
        onClose={() => setShowAddList(false)}
      />
    )}

    </>
  )
}

export default GamePage