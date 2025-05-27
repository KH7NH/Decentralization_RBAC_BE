// Level1: Một user chỉ có thể có một role duy nhất

export const MOCK_ROLES_LEVEL_1 = {
    ClIENT: 'client',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
}

export const MOCK_USER_LEVEL_1 = {
    ID: 'trungquandev-sample-id-12345678',
    EMAIL: 'trungquandev.official@gmail.com',
    PASSWORD: 'trungquandev@123',
    ROLE: MOCK_ROLES_LEVEL_1.ADMIN
}