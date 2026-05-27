import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './app.css';
import './ReactToastify.css';
import Verify from './components/verify/verify';
import Unsubscribe from './components/unsubscribe/unsubscribe';

function App() {
  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        className='toast-container'
      />
      <div>
        <Routes>
          <Route path='/' element={<Outlet />}>
            <Route path='unsubscribe' element={<Unsubscribe />} />
            <Route path='verify' element={<Verify />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}
export default App;
