import { StatusCodes } from "http-status-codes"
import {
    JwtProvider,
    ACCESS_TOKEN_SECRET_SIGNATURE
} from '~/providers/JwtProvider'
// Middleware này sẽ đảm nhiệm việc quan trọng: Lấy và xác thực các JWT accessToken nhận được từ phía FE có
// hợp lệ không
// !!!: Chỉ sử dụng 1 trong 2 cách lấy token
const isAuthorized = async(req, res, next) =>{
    // Cách 1: Lấy accessToken nằm trong request cookie từ phía client - withCredentials trong file
    // authorization và credentials trong CORS
    const accessTokenFromCookie = req.cookies?.accessToken
    if(!accessTokenFromCookie){
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized: token not found'})
        return
    }

    // Cách 2: Lấy accessToken trong trường hợp phía FE lưư Localstorage và gửi lên thông tin header authorization
    const accessTokenFromHeader = req.headers.authorization
    if (!accessTokenFromHeader) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized: token not found'})
        return
    }

    try {
    // Bước 1: Thực hiện giải mã token xem có hợp lệ hay không?
        const accessTokenDecoded = await JwtProvider.verifyToken(
            // accessTokenFromCookie, //  Dùng token theo cookie
            accessTokenFromHeader.substring('Bearer '.length), //   Dùng token theo localstorage
            ACCESS_TOKEN_SECRET_SIGNATURE
        )
    // Bước 2: Quan trọng: Nếu như cái token hợp lệ thì phải lưu thông tin giải mã được vào cái
    // req.jwtDecoded, để sử dụng cho các tầng cần xử lý ở phía sau
        req.jwtDecoded = accessTokenDecoded
    // Bước 3: Cho phép cái request đi tiếp
    next()
    } catch (error) {
        console.log('Error from middleware: ', error)
    // TH1: Nếu các accessToken bị hết hạn (expired) thì mình cần trả về một cái lỗi GONE-410 cho phía FE
    // biết để gọi api refreshToken
        if(error.message?.includes('jwt expired')){
            res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' })
            return
        }

    // TH2: Nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác TH hết hạn thì chúng ta cứ thẳng
    // tay trả về mã lỗi 401 cho FE xử lý logout 
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Plz login' })
    }
}

export const authMiddleware  = {
    isAuthorized
}