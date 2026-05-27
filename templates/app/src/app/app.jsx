import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, Outlet, useSearchParams } from 'react-router-dom';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { ToastContainer } from 'react-toastify';
import * as s from './app.styles';
import NoMatch from './notFound';
import Home from './home';
import InvalidScreenDimensions from './invalidScreenDimensions';
import useAuthenticatedSession from './useAuthenticatedSession';
import './app.css';
import 'react-toastify/dist/ReactToastify.css';

// Call it once in your app. At the root of your app is the best place

const Header = React.lazy(() => import('../views/header'));
const LeftNav = React.lazy(() => import('../views/left-nav'));

function App() {
  const appWrapperRef = useRef();
  const [screenWidth, setScreenWidth] = useState();
  const [searchParams] = useSearchParams();

  useAuthenticatedSession();

  const updateScreenDimensions = () => {
    const newWidth = appWrapperRef.current.clientWidth;
    setScreenWidth(newWidth);
  };

  // Update 'width' and 'height' when the window resizes
  useEffect(() => {
    window.addEventListener('resize', updateScreenDimensions);
    if (screenWidth === null || screenWidth === undefined) {
      updateScreenDimensions();
    }
    return () => window.removeEventListener('resize', updateScreenDimensions);
  }, [screenWidth, searchParams]);

  return (
    <s.Wrapper ref={appWrapperRef}>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        theme='colored'
      />
      <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='45px' circle={false} duration={1.4} />}>
        <Header />
      </Suspense>
      {screenWidth < 1024 && <InvalidScreenDimensions />}
      {screenWidth >= 1024 && (
        <s.ContentWrapper id='content-wrapper'>
          <div>
            <s.LeftNavWrapper>
              <Suspense
                fallback={<LoadingSkeleton count={1} width='48px' height='100%' circle={false} duration={1.4} />}
              >
                <LeftNav style={{ marginRight: 16 }} />
              </Suspense>
            </s.LeftNavWrapper>
            <Routes>
              <Route
                path='/'
                element={
                  <s.InnerContentWrapper>
                    <Outlet />
                  </s.InnerContentWrapper>
                }
              >
                <Route index element={<Home />} />
              </Route>
              <Route path='*' element={<NoMatch />} />
            </Routes>
          </div>
        </s.ContentWrapper>
      )}
    </s.Wrapper>
  );
}
export default App;
