import { MOCK_ROLES_LEVEL_3 } from '../models/mock_Database-Level-3.js'

// Lấy tất cả quyền (permissions) từ một role từ user, bao gồm cả quyền kể thừa 
export const getPermissionsFromRole = async (roleName) => {
    // Thực tế bước này sẽ await vào DB bảng roles để lấy role từ DB nên cứ để func là async
    const role = MOCK_ROLES_LEVEL_3.find(i => i.name === roleName)
    // Nếu role không tồn tại thì trả về mảng rỗng, nghĩa user không có quyền gì
    if (!role) return []

    /** Đối với các thao tác cần hiệu suất cao khi duyệt qua các phần tử thì dùng Set Object để tối ưu
         * hiệu năng xử lý (Tìm kiếm, thêm, xóa) hơn xử lý Array thông thường
         Ví dụ: Array.includes() có độ phức tạp O(n) sẽ chậm hơn so với Set.has() có độ phức tạp O(1) */
    let permissions = new Set(role.permissions)

    // Xử lý kế thừa quyền nếu như role có tồn tại field inherits với dữ liệu
    if (Array.isArray(role.inherits) && role.inherits.length > 0) {
        for (const inheritedRoleName of role.inherits) {
            // Đệ quy lại chính function này để lấy toàn bộ quyền kế thừa(permission) của role hiện tại
            const inheritedPermissions = await getPermissionsFromRole(inheritedRoleName)
            inheritedPermissions.forEach(i => permissions.add(i))
        }
    }
    // Trả về kết quả là một mảng các permissions nên sẽ dùng Array.from vì permissions là Set object.
    return Array.from(permissions)
}