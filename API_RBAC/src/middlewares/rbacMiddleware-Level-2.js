import { StatusCodes } from "http-status-codes"
import { MOCK_ROLES_LEVEL_2 } from "~/models/mock_Database-Level-2"

// Middleware Level 2 phức tạp hơn Level 1: Lúc này chúng ta sẽ nhận tham số đầu vào một mảng các permissions
// được phép truy cập vào API

// Nhận vào requiredPermissions là một mảng permissions được phép truy cập vào API
const isValidPermission = (requiredPermissions) => async (req, res, next) => {

    try {
        // Bước 1: Phải hiểu được luồng: Middleware RBAC sẽ luôn chạy sau authMiddleware, vì vậy đảm bảo JWT token
        // phải hợp lệ và có dữ liệu Decoded

        // Bước 2: Lấy role của user trong dữ liệu payload decoded từ JWT token
        // Lưu ý: tuỳ vào từng loại dự án, nếu sẵn sàng đánh đổi về hiệu năng thì những dự án có thể truy cập
        // vào database ở bước này để lấy full thông tin của user bao gồm cả role từ database ra và sử dụng
        const userRole = req.jwtDecoded.role

        // Bước 3: Kiểm tra xem role
        if (!userRole) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Forbidden: Có vấn đề với role của bạn'
            })
            return
        }

        // Bước 4: Dựa theo role của user rồi tìm tiếp trong database để lấy ra đầy đủ thông tin của role đó
        const fullUserRole = MOCK_ROLES_LEVEL_2.find(i => i.name === userRole)
        if (!fullUserRole) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Forbidden: Không tìm thấy role của bạn trong hệ thống'
            })
            return
        }

        // Bước 5: Kiểm tra xem role có quyền truy cập vào API hay không
        /** Lưu ý: Nếu không cung cấp mảng requiredPermissions hoặc mảng requiredPermissions là rỗng thì ý 
         * nghĩa ở đây thường là không check quyền => luôn cho phép truy cập vào API
         * Hàm Every của js sẽ luôn trả về true nếu mảng sử dụng rỗng
         */
        const hasPermission = requiredPermissions?.every(i => fullUserRole.permissions.includes(i))
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

export const rbacMiddleware_Level_2 = {
    isValidPermission
}