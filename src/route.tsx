import Matrix from './pages/Transform/matrix'
import TriangleFormat from './pages/Format/triangleFormat'
import LineFormat from './pages/Format/lineFormat'
import Demo from './pages/Other/default'
import ErrorPage from './pages/error'
import Root from './pages/home';
import Outer from './pages/outer'
import CircleFormat from './pages/Format/circleFormat'
import Grid from './pages/geometry/grid'
import Hold from './pages/geometry/hole'
import HighMap from './pages/geometry/highMap'
import { LoadModel } from './pages/Model/loadModel'
import RayPick from './pages/Other/rayPick'
import Axis from './pages/Transform/axis'
import CesiumDemo from './pages/cesiumDemo'
import ColorPick from './pages/Other/colorPick'
import Waiting from './pages/waiting'

const Routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/transform",
        title: '变换',
        element: <Outer />,
        children: [
          {
            path: "/transform/matrix",
            title: '矩阵',
            element: <Matrix />,
          },
          {
            path: "/transform/axis",
            title: '极坐标系',
            element: <Axis />,
          },
        ]
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
          },
          {
            path: "/geometry/high-map",
            title: '高度图',
            element: <HighMap />,
          },
        ]
      },

      {
        path: "/model",
        title: '模型',
        element: <Outer />,
        children: [
          {
            path: "/model/load-model",
            title: '模型加载',
            element: <LoadModel />,
          },
        ]
      },
      {
        path: '/other',
        element: <Outer />,
        title: '杂项',
        children: [
          {
            path: "/other/shadow",
            title: '阴影 法线贴图',
            element: <Demo />,
          },
          {
            path: "/other/ray-pick",
            title: '选取1（基于射线）',
            element: <RayPick />,
          },
          {
            path: "/other/edge",
            title: '选取2（基于GPU）',
            element: <Waiting />,
          },
        ]
      },
      {
        path: "/cesium",
        title: 'cesium',
        element: <CesiumDemo />,
      },
    ],
  },
]

export default Routes