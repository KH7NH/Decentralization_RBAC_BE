import { Navigate, Outlet } from "react-router-dom"
import { usePermission } from "~/hooks/usePermission"
import { roles } from "~/config/rbacConfig"

function RbacRoute({ 
    requiredPermission, 
    redirectTo = '/access-denied', 
    children // Dùng cho dự án react-router-dom v5
}) {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const userRole = user?.role || roles.CLIENT
    const { hasPermission } = usePermission(userRole)

    // Neu user khong co quyen thi chuyen huong den trang AccessDenied 
    if (!hasPermission(requiredPermission)) {
        return <Navigate to={redirectTo} replace={true} />
    }
    // Dùng Outlet (Cách này sử dụng cho dự án react-router-dom v6) hiện đại và dễ bảo trì hơn
    return <Outlet />
    // Dùng children (Cách này sử dụng cho dự án react-router-dom v5)
    //return children
}
export default RbacRoute