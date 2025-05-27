// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider,
  REFRESH_TOKEN_SECRET_SIGNATURE, 
  ACCESS_TOKEN_SECRET_SIGNATURE 
} from '~/providers/JwtProvider'
import { MOCK_USER_LEVEL_1 } from '~/models/mock_Database-Level-1.js'
import { MOCK_USER_LEVEL_2 } from '~/models/mock_Database-Level-2.js'


const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_USER_LEVEL_2.EMAIL || req.body.password !== MOCK_USER_LEVEL_2.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // Tạo thông tin payload đính kèm trong JWT : bao gồm id, email của user
    const userInfo = {
      id: MOCK_USER_LEVEL_2.ID,
      email: MOCK_USER_LEVEL_2.EMAIL,
      // role: MOCK_USER_LEVEL_1.ROLE
      role: MOCK_USER_LEVEL_2.ROLE
    }

    // Tạo ra hai loại token, accessToken và refreshToken để trả về phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5 // 5 giay
      '1h'
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      //15//15 giay
      '14 days'
    )
    /**
     Xử lý trường hợp trả về cho http only cookie cho phía trình duyệt 
     về cái maxAge và thư viện ms : https://expressjs.com/en/5x/api.html#res.cookie
     Đối vói cái maxAge thời gian sống của cookie thì chúng ta sẽ để tối đa là 14day, tuỳ dự án.
     Thời gian sống của cookie khác vói thời gian sống của token
     */

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Trả về thông tin của user cũng như trả về token cho trường hợp phía FE cần lưu Tokens vào LocalStorage
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Xoá cookie đơn giản là làm ngược lại so vói việc gán cookie ở hàm login
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    //C1: Lấy refreshToken luôn từ cookie đã đính kèm vào request
    const refreshTokenFromCookie = req.cookies?.refreshToken

    //C2: Từ localstorage phía FE sẽ truyền vào body khi gọi API
    const refreshTokenFromBody = req.body?.refreshToken
    
    // Verify giải mã các refresh token xem có hợp lệ không 
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie, //  Dùng token theo cookie
      //refreshTokenFromBody, //   Dùng token theo localstorage
      REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Đoạn này vì chúng ta chỉ lưu thông tin unique và cố định của user trong token rồi, vì vậy có thể
    // lấy luôn từ decoded ra, tiết kiệm query để vào DB lấy data mới.
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role
    }
    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5 // 5 giay
      '1h'
    )

    // Res lại cookie accessToken mới cho trường hợp sử dụng cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Trả về accessToken mới cho TH FE cần update lại Localstorage
    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Refresh Token API failed'})
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
