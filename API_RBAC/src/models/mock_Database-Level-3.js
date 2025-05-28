// Level 3: Group Roles & Hierarchical RBAC
/** Group Roles: Một user có thể có nhiều vai trò (roles)
 * Hierarchical RBAC: Vai trò có thể kế thừa từ vai trò khác */

// CRUD ( Create, Read, Update, Delete ) 
export const MOCK_ROLES_LEVEL_3 = [
    {
        _id: 'role-client-sample-id-12345678',
        name: 'client',
        permissions: [
            'create_support',
            'read_support',
            'update_support',
            'delete_support'
        ],
        inherits: [] // Không kế thừa từ permissions của role nào khác
    },
    {
        _id: 'role-modorator-sample-id-12345678',
        name: 'modorator',
        permissions: [
            // messages
            'create_messages',
            'read_messages',
            'update_messages',
            'delete_messages'
        ],
        inherits: ['client'] // Kế thừa lại tất cả permissions của role client
    },
    {
        _id: 'role-admin-sample-id-12345678',
        name: 'admin',
        permissions: [  
            // admin-tools
            'create_admin_tools',
            'read_admin_tools',
            'update_admin_tools',
            'delete_admin_tools'
        ],
        inherits: ['client', 'modorator'] // Kế thừa lại tất cả permissions của role client và modorator
    }
]

export const MOCK_USER_LEVEL_3 = {
    ID: 'trungquandev-sample-id-12345678',
    EMAIL: 'trungquandev.official@gmail.com',
    PASSWORD: 'trungquandev@123',
    /** Một user lúc này có thể có nhiều roles, lưu ý nếu muốn dùng cách 3 này ở phía UI thì phần FE ở RBAC
     *  Frontend trước phải câp nhật lại cho chuẩn. Vì ở bộ trước FE đang xư lý theo cách 1 user 1 role */

    // ROLES: ['client']
    // ROLES: ['modorator'] 
    ROLES: ['admin']
    // ROLES: ['client', 'modorator', 'admin']
}