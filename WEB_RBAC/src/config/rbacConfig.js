// Định nghĩa role của user trong hệ thôngs
export const roles = {
    CLIENT: 'client',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
}

// Định nghĩa các quyền permissions trong hệ thống
export const permissions = {
    VIEW_DASHBOARD: 'view_dashboard',
    VIEW_SUPPORT: 'view_support',
    VIEW_MESSAGE: 'view_message',
    VIEW_REVENUE: 'view_revenue',
    VIEW_ADMIN_TOOL: 'view_admin_tool',
}

// Kết hợp role và permissions để xác định quyền hạn của user
export const rolePermissions = {
    [roles.CLIENT]: [
        permissions.VIEW_DASHBOARD,
        permissions.VIEW_SUPPORT
    ], 
    [roles.MODERATOR]: [
        permissions.VIEW_DASHBOARD,
        permissions.VIEW_SUPPORT,
        permissions.VIEW_MESSAGE
    ],
    [roles.ADMIN]: Object.values(permissions) // all permissions
    // [roles.ADMIN]: [
    //     permissions.VIEW_DASHBOARD,
    //     permissions.VIEW_SUPPORT,
    //     permissions.VIEW_MESSAGE,
    //     permissions.VIEW_REVENUE,
    //     permissions.VIEW_ADMIN_TOOL
    // ]
}