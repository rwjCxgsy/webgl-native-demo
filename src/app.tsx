import React from 'react';
import {createRoot} from 'react-dom/client';
import Root from './pages/home';
import  './index.css'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import Matrix from './pages/matrix'
import Format from './pages/format'
import LineFormat from './pages/lineFormat'
import Demo from './pages/default'
import ErrorPage from './pages/error'

const root = document.getElementById('root')!;

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/matrix",
        element: <Matrix />,
      },
      {
        path: "/line-format",
        element: <LineFormat />,
      },
      {
        path: "/format",
        element: <Format />,
      },
      {
        path: "/demo",
        element: <Demo />,
      },
    ],
  },
]);

createRoot(root).render( <RouterProvider router={router} />);

(window as any).alert = (content: string) => {
  const div = document.createElement("div");
  div.innerHTML = `
    <div id="alert"><span>${content}</span></div>
  `
  document.body.appendChild(div);
  return function destroy () {
    document.body.removeChild(div);
  }
}