import React, { useEffect, useState } from 'react';
import './GameCard.css'
import playIcon from '../../assets/playstation.png'
import xboxIcon from '../../assets/xbox.png'
import pcIcon from '../../assets/pc.png'
import nintendoIcon from '../../assets/nintendo.png'
import segaIcon from '../../assets/sega.png'
import appleIcon from '../../assets/apple.png'
import linuxIcon from '../../assets/linux.png'
import androidIcon from '../../assets/android.png'
import { useNavigate } from 'react-router-dom';

const GameCard = ({ id, imageUrl, gameName, platforms, screenshoots, genre, date, wishGames, listGames, onHoverStart, onHoverEnd, onAddListClick, comment, rating }) => {
  
  const navigate = useNavigate()
  //const apiUrl = import.meta.env.VITE_API_URL

  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlistText, setWishlistText] = useState('Lista de Desejos')
  const [removed, setRemoved] = useState('')
  
  useEffect(() => {
  if (!screenshoots || screenshoots.length === 0) return;

  const interval = setInterval(() => {
    setCurrentIndex(prevIndex =>
      (prevIndex + 1) % screenshoots.length
    );
  }, 2000);

  return () => clearInterval(interval);
}, [screenshoots]);


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

    platforms.forEach(p => {
      const name = p.platform.name.toLowerCase();

      if (name.includes('playstation') && playstationCounter == 0) {
        icons.push(<img key={`ps-${name}`} src={playIcon} alt="PlayStation" className='platform-icon' />);
        playstationCounter++;
      }

      if (name.includes('xbox') && xboxCounter == 0) {
        icons.push(<img key={`xbox-${name}`} src={xboxIcon} alt="Xbox" className='platform-icon' />);
        xboxCounter++;
      }

      if (name.includes('pc') && pcCounter == 0) {
        icons.push(<img key={`pc-${name}`} src={pcIcon} alt="PC" className='platform-icon' />);
        pcCounter++;
      }

      if (name.includes('mac') && appleCounter == 0) {
        icons.push(<img key={`apple-${name}`} src={appleIcon} alt="apple" className='platform-icon' />);
        appleCounter++;
      }

      if (name.includes('linux') && linuxCounter == 0) {
        icons.push(<img key={`linux-${name}`} src={linuxIcon} alt="linux" className='platform-icon' />);
        linuxCounter++;
      }

      if (name.includes('android') && androidCounter == 0) {
        icons.push(<img key={`android-${name}`} src={androidIcon} alt="android" className='platform-icon' />);
        androidCounter++;
      }

      if ((name.includes('nintendo') || name.includes('nes') || name.includes('wii')) && nintendoCounter == 0) {
        icons.push(<img key={`nintendo-${name}`} src={nintendoIcon} alt='Nintendo' className='platform-icon' />);
        nintendoCounter++;
      }

      if (name.includes('sega') && segaCounter == 0) {
        icons.push(<img key={`sega-${name}`} src={segaIcon} alt='sega' className='sega-icon' />)
        segaCounter++;
      }
    });

    return icons;
  };

 const getScreenshots = () => {
  if (!screenshoots || !Array.isArray(screenshoots) || screenshoots.length === 0) {
    return <div className="screenshots-carousel">
        <img
          key={'default-image'}
          src={imageUrl}
          className={`card-image`}
        />
      
    </div>
  }

  return (
    <div className="screenshots-carousel">
      {screenshoots.map((screenshot, index) => (
        <img
          key={index}
          src={screenshot.image}
          className={`card-image ${index !== currentIndex ? 'image-disabled' : ''}`}
          alt={`Screenshot ${index + 1}`}
        />
      ))}
    </div>
  );
  };
  
  const addToWishlist = async () => {
    const userId = localStorage.getItem('id')
    const token = localStorage.getItem('token')
    if (!userId || !token) return
    
    try {
      const response = await fetch(`/api/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({name: gameName, userId: parseInt(userId), gameId: parseInt(id)})
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

   const removeFromWishlist = async () => {
    const userId = localStorage.getItem('id')
    const token = localStorage.getItem('token')
    const gameId = parseInt(id)
    if (!userId || !token) return
    
    try {
      const response = await fetch(`/api/wishlist/${userId}/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }
      setRemoved('hide')
    } catch (error) {
      setWishlistText('Falha ao adicionar X')
      console.error(error)
    }
  };

  const removeFromListGames = async () => {
    const userId = localStorage.getItem('id')
    const token = localStorage.getItem('token')
    const gameId = parseInt(id)
    if (!userId || !token) return
    
    try {
      const response = await fetch(`/api/gamesList/${userId}/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }
      setRemoved('hide')
    } catch (error) {
      console.error(error)
    }
  };

  const goToGame = () => {
    navigate(`/game/${id}`);
  };


  return (
   <div className={`Game-card-wrapper ${removed}`} >
    <div
      className="Game-card d-flex flex-column position-relative" 
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={goToGame}  
    >
    <img className="card-image main-image" src={imageUrl} alt="" />
    {getScreenshots()}
    <div className="infos d-flex flex-column justify-content-between">
      <div className="platforms">{getPlatformIcons()}</div>
       <p className="game-name my-0">{gameName}</p>
       
       {rating !== undefined && comment !== undefined &&
          <>
            <p className='text-light fs-4 hide-info py-0 my-0'>{'★'.repeat(rating)}</p>
            <p className='hide-info my-0'>{comment}</p>
          </>
        }

        {genre !== undefined && date !== undefined &&
          <>
            <p className='info-box hide-info  my-1'>{genre}</p>
            <p className='fs-6 text-secondary hide-info  my-0'>Lançamento: {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</p>
          </>
        }

       
       
       <div className='botoes'>
        {!listGames && (
          <>
            {!wishGames ? (
              <button
               onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist();
                }}
                className="wishlist add-list btn w-100 mt-2"
              >
                {wishlistText}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist();
                }}
                className="wishlist remove add-list btn w-100 mt-2"
              >
                Remover da wishlist
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddListClick({ id, name: gameName });
              }}
              className="add-list btn w-100 mt-2"
            >
              Lista de Jogados
            </button>
          </>
        )}

        {listGames && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromListGames();
            }}
            className="remove add-list btn w-100 mt-2"
          >
            Remover da lista de jogos
          </button>
        )}
      </div>
    </div>
  </div>
</div>
      );


}

export default GameCard