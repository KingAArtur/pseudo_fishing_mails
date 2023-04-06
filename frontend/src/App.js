import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Auth from './pages/auth';
import Schedule from './pages/schedule';
import History from './pages/history';
import Response from './pages/response';
import Subject from './pages/subject';
import User from './pages/user';
import Home from './pages/home';
import ErrorPage from './pages/error-page';

const App = () => {
  return (
    <div className="App bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/auth" element={<Auth />} />
          <Route exact path="/schedule" element={<Schedule />} />
          <Route exact path="/history" element={<History />} />
          <Route exact path="/response" element={<Response />} />
          <Route exact path="/subjects" element={<Subject />} />
          <Route exact path="/users" element={<User />} />
          <Route exact={true} path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
