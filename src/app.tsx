import {createRoot} from 'react-dom/client';
import  './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom';

import Routes from './route';

const root = document.getElementById('root')!;

const router = createHashRouter(Routes);

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