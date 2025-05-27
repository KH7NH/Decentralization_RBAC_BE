// Level 2: Vẫn là một user chỉ được gán với một vai trò (role) duy nhất, nhưng mỗi role có thể 
// có nhiều quyền hạn (permissions) khác nhau được chia nhỏ ra

export const MOCK_ROLES_LEVEL_2 = [
    {
        _id: 'role-client-sample-id-12345678',
        name: 'client',
        permissions: [
            'create_support',
            'read_support',
            'update_support',
            'delete_support'
        ]
    },
    {
        _id: 'role-modorator-sample-id-12345678',
        name: 'modorator',
        permissions: [
            // support
            'create_support',
            'read_support',
            'update_support',
            'delete_support',
            // messages
            'create_messages',
            'read_messages',
            'update_messages',
            'delete_messages'
        ]
    },
    {
        _id: 'role-admin-sample-id-12345678',
        name: 'admin',
        permissions: [
            // support
            'create_support',
            'read_support',
            'update_support',
            'delete_support',
            // messages
            'create_messages',
            'read_messages',
            'update_messages',
            'delete_messages',
            // admin-tools
            'create_admin_tools',
            'read_admin_tools',
            'update_admin_tools',
            'delete_admin_tools'
        ]
    }
]

export const MOCK_USER_LEVEL_2 = {
    ID: 'trungquandev-sample-id-12345678',
    EMAIL: 'trungquandev.official@gmail.com',
    PASSWORD: 'trungquandev@123',
    ROLE: 'admin' //Role phải là unique và ăn theo đúng name với bangr role trong DB như trên
}