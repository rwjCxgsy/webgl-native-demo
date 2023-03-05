import Matrix from './pages/matrix'
import TriangleFormat from './pages/triangleFormat'
import LineFormat from './pages/lineFormat'
import Demo from './pages/default'
import ErrorPage from './pages/error'
import Root from './pages/home';
import Outer from './pages/outer'
import CircleFormat from './pages/circleFormat'
import Grid from './pages/grid'
import Hold from './pages/hole'

const Routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/matrix",
        title: '矩阵变换',
        element: <Matrix />,
      },
      {
        path: "/format",
        title: '插值',
        element: <Outer />,
        children: [
          {
            title: '线段',
            path: "/format/line-format",
            element: <LineFormat />,
          },
          {
            title: '三角形',
            path: "/format/triangle-format",
            element: <TriangleFormat />,
          },
          {
            title: '曲线插值',
            path: '/format/circle-format',
            element: <CircleFormat/>
          }
        ]
      },
      {
        path: "/geometry",
        title: '网格',
        element: <Outer />,
        children: [
          {
            title: '多边形三角化',
            path: "/geometry/gird",
            element: <Grid />,
          },
          {
            title: '挖洞',
            path: "/geometry/doll",
            element: <Hold />,
          }
        ]
      },
      {
        path: "/demo",
        title: 'demo',
        element: <Demo />,
      },
    ],
  },
]

export default Routes