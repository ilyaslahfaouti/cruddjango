import React, { useState } from 'react';
import './connexion.css';
import axios from 'axios';



const Auth = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });


  const handleChangeRegister = (e) => {
    setUser((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    console.log(user);
    axios.post('http://127.0.0.1:8000/api/users/signup', user)
      .then(response => console.log(response.data))
  }

  const handleSignUpClick = () => {
    const container = document.getElementById('container');
    container.classList.add('right-panel-active');
  };

  const handleSignInClick = () => {
    const container = document.getElementById('container');
    container.classList.remove('right-panel-active');
  };


  return (
    <div>
    
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" name='name' onChange={handleChangeRegister} />
            <input type="email" placeholder="Email" name='email' onChange={handleChangeRegister} />
            <input type="password" placeholder="Password" name='password' onChange={handleChangeRegister} />
            <button onClick={handleSubmitRegister}>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" name='email'  />
            <input type="password" placeholder="Password" name='password'  />
            <a href="#">Forgot your password?</a>
            <button>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start the journey with us</p>
              <button className="ghost" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
