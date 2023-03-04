import { Outlet, Link } from "react-router-dom";
export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h2 style={{textAlign: 'center'}}>计算机图形学</h2>
        <nav>
          <ul>
            <li>
              <Link to={`/matrix`}>矩阵</Link>
            </li>
            <li>
              <Link to={`/line-format`}>线段光栅化</Link>
            </li>
            <li>
              <Link to={`/format`}>光栅化 插值</Link>
            </li>
            <li>
              <Link to={`/demo`}>demo</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet/>
      </div>
    </>
  );
}