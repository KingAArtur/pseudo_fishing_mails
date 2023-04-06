import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';

import FastAPIClient from '../../client';
import config from '../../config';
import jwtDecode from "jwt-decode";
import * as moment from "moment";

const client = new FastAPIClient(config);

function DashboardHeader() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tokenString = localStorage.getItem("token")
	if (tokenString) {
        const token = JSON.parse(tokenString)
        const decodedAccessToken = jwtDecode(token.access_token)
        if(moment.unix(decodedAccessToken.exp).toDate() > new Date()){
            setIsLoggedIn(true)
        }
    }
  }, [])

  const handleLogout = () => {
    client.logout();
    setIsLoggedIn(false)
    navigate('/')
  }

  const handleLogin = () => {
    navigate("/auth");
  }

  let displayButton;
  const buttonStyle = "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"

  if (isLoggedIn) {
      displayButton = <button className={buttonStyle} onClick={() => handleLogout()}>Logout</button>;
    } else {
      displayButton = <button className={buttonStyle} onClick={() => handleLogin()}>Login</button>;
    }

  return (
      <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
            <a href={"/"}><svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
            </svg></a>
            <span className="font-semibold text-xl tracking-tight">Pseudo fishing mails</span>

        </div>

        <div className={`animate-fade-in-down w-full "block" flex-grow lg:flex lg:items-center lg:w-auto`}>
            <div className="text-sm lg:flex-grow">
                <Link to="/users"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    Пользователи
                </Link>
                <Link to="/subjects"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    Испытуемые
                </Link>
                <Link to="/schedule"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    Письма к отправке
                </Link>
                <Link to="/history"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    Отправленные письма
                </Link>
                <Link to="/response"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    Отклики
                </Link>
            </div>
            <div>
              {displayButton}
            </div>
        </div>
      </nav>
  );
}

export default DashboardHeader;
