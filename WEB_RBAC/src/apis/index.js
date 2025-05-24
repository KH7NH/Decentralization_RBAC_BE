import authenrizedAxiosInstance from "~/utils/authorizedAxios"
import { API_ROOT } from "~/utils/constants"

export const handleLogoutAPI = async() =>{
    // TH1: Dùng localStorage > chỉ cần xoá thông tin user trong localstorage phía FE
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')

    // TH2: Dùng Http only cookie > Gọi API để xử lý remove cookies
    return await authenrizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
}

export const refreshTokenAPI = async(refreshToken) => {
    return await authenrizedAxiosInstance.put(`${API_ROOT}/v1/users/refresh_token`, {refreshToken})
}