import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout.js';
import { HomePage } from './pages/HomePage.js';
import { UiPreviewPage } from './pages/UiPreviewPage.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { RegisterPage } from './pages/auth/RegisterPage.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: '_ui',
        element: <UiPreviewPage />,
      },
      {
        path: '*',
        element: (
          <div style={{ textAlign: 'center', padding: '96px 24px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>404 &mdash; Page Not Found</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              The page you are looking for does not exist.
            </p>
          </div>
        ),
      },
    ],
  },
]);
