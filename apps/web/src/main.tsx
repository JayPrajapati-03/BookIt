import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { router } from './router.js';
import { AuthBootstrap } from './components/auth/AuthBootstrap.js';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </Provider>
  </React.StrictMode>,
);
