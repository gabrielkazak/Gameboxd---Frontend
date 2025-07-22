import React, { useState } from 'react';
import './AddList.css';
import StarRating from '../StarRating/StarRating.jsx';

const AddList = ({ gameId, name, userId, token,  onClose }) => {
  
  //const addUrl = import.meta.env.VITE_API_URL;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleAddGame = async () => {
  if (!rating && !comment.trim()) {
    alert("Por favor, avalie e escreva um comentário antes de enviar.");
    return;
  }

  try {
    const response = await fetch(`/api/gamesList/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, rating, comment, userId, gameId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro desconhecido');
    }

    onClose();

  } catch (error) {
    alert(`${error.message}`);
    console.error(error);
  }
};


  return (
    <div className="add-list-container">
      <div className="list-top d-flex justify-content-between align-items-center">
        <p className="add-list-title">Adicionar à Minha Lista</p>
        <p className="close-button fs-4" onClick={onClose}>X</p>
      </div>

      <div className="form-infos">
        <p className="form-label">
          Título do Jogo: <span className="game-title">{name}</span>
        </p>

        <div className="rating-group">
          <p className="form-label">Avalie este Jogo:</p>
          <StarRating initialRating={rating} onRatingChange={handleRatingChange} />
        </div>

        <textarea
          name="comment"
          id="comment"
          className="comment"
          placeholder="Escreva aqui seu comentário sobre esse jogo"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>

      <button className="add-list-btn" onClick={async () => { await handleAddGame() }}>Enviar para a Lista</button>
    </div>
  );
};

export default AddList;
