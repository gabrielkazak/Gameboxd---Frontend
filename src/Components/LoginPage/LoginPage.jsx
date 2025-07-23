import React, { useState } from 'react';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/password.png';
import personIcon from '../../assets/person.png';
import './LoginPage.css'

//const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState('Login');

  const handleLoginSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('id', result.user.id);
        localStorage.setItem('name', result.user.name);
        localStorage.setItem('token', result.accessToken);
        window.location.href = '/dashboard';
      } else {
        alert(result.message || 'Erro no login');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de rede no login');
    }
  };

  const handleRegisterSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch(`/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('id', result.user.id);
        localStorage.setItem('name', result.user.name);
        localStorage.setItem('token', result.user.accessToken);
        window.location.href = '/dashboard';
      } else {
        alert(result.message || 'Erro no registro');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de rede no registro');
    }
  };

  return (
    <div className="login-container">
    <div className='form col-10 d-flex flex-column align-items-center'>
      <div className='fs-1'>{action}</div>

      <div className='inputs d-flex flex-column '>
        {action === 'Register' && (
          <div className='input d-flex gap-1 align-items-center'>
            <img className='form-img' src={personIcon} alt='' />
            <input
              type='text'
              placeholder='Nome'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className='input d-flex gap-1 mt-2 align-items-center'>
          <img className='form-img' src={emailIcon} alt='' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='input d-flex gap-1 mt-2 align-items-center'>
          <img className='form-img' src={passwordIcon} alt='' />
          <input
            type='password'
            placeholder='Senha'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className='botoes d-flex justify-content-between mt-3'>
        <button
          className={`form-button ${action === 'Login' ? '' : 'disabled'}`}
          onClick={() => {
            if (action === 'Login') {
              handleLoginSubmit();
            } else {
              setAction('Login');
            }
          }}
        >
          Login
        </button>

        <button
          className={`form-button ${action === 'Register' ? '' : 'disabled'}`}
          onClick={() => {
            if (action === 'Register') {
              handleRegisterSubmit();
            } else {
              setAction('Register');
            }
          }}
        >
          Register
        </button>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
