import { Outlet, Link } from 'react-router-dom';
import Routes from '../route';


export default function Root() {


  function createLink(list: any[]) {
    return list.map((route) => {
      return (
        <li key={route.path}>
          <Link to={route.path}>{route.title}</Link>
          {
            route.children?.length ? <ol>{createLink(route.children)}</ol> : ''   
          }
        </li>
      )
    })
  }

  return (
    <>
      <div id="sidebar">
        <h2 style={{ textAlign: 'center' }}>计算机图形学</h2>
        <nav>
          <ul>
            {
              createLink(Routes[0].children)
            }
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
