import { StatusCodes } from "http-status-codes"

// Middleware Level 1: Một user chỉ có thể có một quyền hạn duy nhất
// Nhận vào allowedRoles là một mảng các role được phép truy cập vào API
const isValidPermission = (allowedRoles) => async (req, res, next) => {

    try {
    // Bước 1: Phải hiểu được luồng: Middleware RBAC sẽ luôn chạy sau authMiddleware, vì vậy đảm bảo JWT token
    // phải hợp lệ và có dữ liệu Decoded

    // Bước 2: Lấy role của user trong dữ liệu payload decoded từ JWT token
    // Lưu ý: tuỳ vào từng loại dự án, nếu sẵn sàng đánh đổi về hiệu năng thì những dự án có thể truy cập
    // vào database ở bước này để lấy full thông tin của user bao gồm cả role từ database ra và sử dụng
        const userRole = req.jwtDecoded.role

    // Bước 3: Kiểm tra xem role, đơn giản nếu user không tồn tại role hoặc role của user không thuộc scope 
    // role hợp lệ của api thì sẽ không truy cập được
    if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(StatusCodes.FORBIDDEN).json({ 
                message: 'You are not allowed to access this API' 
            })
            return
        }
    // Bước 4: Nếu như role hợp lệ thì cho phép request đi tiếp (sang controller)
    next()
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Opps! Something went wrong' })
    }
}

export const rbacMiddleware_Level_1 = {
    isValidPermission
}