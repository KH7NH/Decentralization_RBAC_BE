import { StatusCodes } from "http-status-codes"
import { MOCK_ROLES_LEVEL_3 } from "~/models/mock_Database-Level-3"
import { getPermissionsFromRole } from "~/utils/rbacUtils.js"
// Level 3: Group Roles & Hierarchical RBAC
/** Group Roles: Một user có thể có nhiều vai trò (roles)
 * Hierarchical RBAC: Vai trò có thể kế thừa từ vai trò khác */

// Nhận vào requiredPermissions là một mảng permissions được phép truy cập vào API
const isValidPermission = (requiredPermissions) => async (req, res, next) => {

    try {
        // Bước 1: Phải hiểu được luồng: Middleware RBAC sẽ luôn chạy sau authMiddleware, vì vậy đảm bảo JWT 
        // token phải hợp lệ và có dữ liệu Decoded

        // Bước 2: Lấy role của user trong dữ liệu payload decoded từ JWT token
        // Lưu ý: tuỳ vào từng loại dự án, nếu sẵn sàng đánh đổi về hiệu năng thì những dự án có thể truy cập
        // vào database ở bước này để lấy full thông tin của user bao gồm cả role từ database ra và sử dụng

        // Với trường hợp level 3 này thì roles sẽ là một mảng (viết roles số nhiều)-> Để tạm
        // số ít req.jwtDecoded.role đỡ phải sửa code
        const userRoles = req.jwtDecoded.role

        // Bước 3: Kiểm tra xem role, user bắt buộc phải có nhất một role theo định nghĩa dự án
        if (!Array.isArray(userRoles) || userRoles.length === 0) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Forbidden: Có vấn đề với role của bạn'
            })
            return
        }

        // Bước 4: Dựa theo mảng userRoles của user rồi tìm tiếp trong database để lấy ra đầy đủ thông tin của
        // role đó
        /** Đối với các thao tác cần hiệu suất cao khi duyệt qua các phần tử thì dùng Set Object để tối ưu 
         * hiệu năng xử lý (Tìm kiếm, thêm, xóa) hơn xử lý Array thông thường
         Ví dụ: Array.includes() có độ phức tạp O(n) sẽ chậm hơn so với Set.has() có độ phức tạp O(1) */ 
        let userPermissions = new Set()
        for( const roleName of userRoles) {
            const rolePermissions = await getPermissionsFromRole(roleName)
            rolePermissions.forEach(i => userPermissions.add(i))
        }

        // Bước 5: Kiểm tra xem role có quyền truy cập vào API hay không
        /** Lưu ý: Nếu không cung cấp mảng requiredPermissions hoặc mảng requiredPermissions là rỗng thì ý 
         * nghĩa ở đây thường là không check quyền => luôn cho phép truy cập vào API
         * Hàm Every của js sẽ luôn trả về true nếu mảng sử dụng rỗng
         */
        const hasPermission = requiredPermissions?.every(i => userPermissions.has(i))
        if (!hasPermission) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Forbidden: Ban không có quyền truy cập vào API này'
            })
            return
        }

        // Bước 6: Nếu như role hợp lệ thì cho phép request đi tiếp (sang controller)
        next()
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Opps! Something went wrong' })
    }
}

export const rbacMiddleware_Level_3 = {
    isValidPermission
}