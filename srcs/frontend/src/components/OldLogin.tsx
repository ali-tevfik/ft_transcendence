import React, { useState } from 'react';
import axios from 'axios';






const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');



  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    console.log('Email value is:', event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    console.log('Password value is:', event.target.value);
  };

  const statusdenem= async () => {
    const response = await axios.get("http://localhost:3001/auth/status");

    console.log(response)
  }

  const goToIntra= async () =>{
    window.location.href = 'http://localhost:3001/auth/login';}
  //   try{

  //   const response = await axios.get('http://localhost:3001/auth/login');
  //   window.location.href = response.data.authUr;
  //   console.log(response);}
  //   catch(error){
  //     console.log(error);
  //   }
  // }

  const handleClick = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('response ', response)
    try {
        const data = { is_online: 'false', password: password, nick_name: email }; // Göndermek istediğiniz JSON veri
        const options = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const response = await axios.post('http://localhost:3001/User/', data, options);
        setResponse(response.data);
      } catch (error) {
        console.error('POST request error:', error);
      }
  };

  return (
    <div className="Login">
      <div className="LoginBox">
        <div className="LoginHeader">Login</div>
        <div className="LoginInput">
          <input
            type="text"
            id="email"
            name="email"
            onChange={handleChangeEmail}
            className="email"
            value={email}
            placeholder="email"
          />
          <input
            value={password}
            onChange={handleChangePassword}
            id="password"
            className="password"
            placeholder="password"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="LoginButton" onClick={handleClick}>
            Login
          </button>
          <button>
            <a href='http://localhost:3001/auth/login'> 42 Intra Login </a>
          </button>
          <button onClick={statusdenem}>status</button>
          <button ><a href='http://localhost:3001/auth/status'>adsa</a></button>
          <button><a href='http://localhost:3001/auth/logout'>logut</a></button>

          <button onClick={goToIntra}>deneme</button>

        </div>
      </div>
    </div>
  );
};

export default Login;
