import { rolePermissions } from "~/config/rbacConfig"

// custom hook để kiểm tra quyền han của user theo role va permission (rbac)
export const usePermission = (userRole) => {
    const hasPermission = (permission) => {
        const allowedPermissions = rolePermissions[userRole] || []
        return allowedPermissions.includes(permission)
    }
    return {
        hasPermission
    }
}