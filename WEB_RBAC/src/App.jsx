// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'
import NotFound from './pages/NotFound'
import AccessDenied from './pages/AccessDenied'
import RbacRoute from './components/core/RbacRoute'
import { permissions } from './config/rbacConfig'

const ProtectedRoute = () =>{
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if(!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}
const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) return <Navigate to="/dashboard" replace={true} />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      <Route element={<UnauthorizedRoutes />}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}
        <Route path='/login' element={<Login />} />
        {/* Đoạn này sau này sẽ còn nhiều route nữa để viết xác thực */}
      </Route>

      <Route element={<ProtectedRoute />}>
      {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}

        {/* Tất cả các element ở đây đều gọi tói cùng component Dashboard vì chúng ta đang gom chung các page 
        dạng tabs và code hết trong component Dashboard này để test cho gọn, thực tế có thể để tách pages và
        component khác nhau tuỳ dự án */}

        {/* Nếu RoleAccessRoute viết code theo cách trả về Outlet thì dùng cách này(cách này thường dùng cho
        dự án xài react-router-dom ver mói 6.x.x trở lên trông hiện đại và dễ bảo trì hơn ) */}
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_DASHBOARD} />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_SUPPORT} />}>
          <Route path='/support' element={<Dashboard />} />
          {/* <Route path='/support/create' element={<Dashboard />} />
          <Route path='/support/update' element={<Dashboard />} />
          <Route path='/support/delete' element={<Dashboard />} /> */} //
        </Route>
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_MESSAGES} />}>
          <Route path='/messages' element={<Dashboard />} />
        </Route>
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_REVENUE} />}>
          <Route path='/revenue' element={<Dashboard />} />
        </Route>
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_ADMIN_TOOL} />}>  
          <Route path='/admin-tools' element={<Dashboard />} />
        </Route>
        {/* Nếu RoleAccessRoute viết code theo cách trả về children thì dùng cách này(cách này thường dùng cho
        dự án xài react-router-dom ver cũ 5.x.x trở xuống)  */}
        {/* <Route 
        path='/dashboard' 
        element={
        <RbacRoute requiredPermission={permissions.VIEW_DASHBOARD}>
          <Dashboard />
        </RbacRoute>
        } 
        /> */}
      </Route>
      
      <Route path='/access-denied' element={<AccessDenied />} />
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App
