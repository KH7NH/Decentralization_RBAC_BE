import JWT from 'jsonwebtoken'

/*
 Function tạo mới một token cần 3 tham số đầu vào
 userinfo: Những thông tin muốn đính kèm vào token
 secretsignature    chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên doc thì để tên privatekey
 tokenlife thời gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
    try {

        return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
    } catch (error) {
        throw Error(error)
    }
}
/**
 function ktr một token có hợp lệ hay không 
 */
const verifyToken = async (token, secretSignature) => {
    try {

        return JWT.verify(token, secretSignature)
    } catch (error) {
        throw Error(error)
    }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

export const JwtProvider = {
    generateToken,
    verifyToken
}