import axios from "axios";
import { toast } from "react-toastify";
import { handleLogoutAPI, refreshTokenAPI } from "~/apis";

//Khởi tạo một dự án Axios authenrizedAxiosInstance mục đích custom và cấu hình chung cho dự án
let authenrizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request là 10p
authenrizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE (Phục vụ cho
// trường hợp chúng ta sử dụng JWT Tokens (refresh và access) theo cơ chế http Only Cookie)
authenrizedAxiosInstance.defaults.withCredentials = true

/** Cấu hình interceptors (Bộ đánh chặn vào giữa mọi Request và Response)
 http://axios-http.com/docs/interceptors
 */
// Add a request interceptor: Can thiệp vào giữa những cái request API
authenrizedAxiosInstance.interceptors.request.use( (config) => {
    // Lấy accessToken từ localstorage và đính kèm vào header
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken){
        /**
        Cần thêm bearer vì chúng ta nên tuân thut theo chuẩn 0Auth 2.0 trong việc xác định loại token đang sử
        dụng
        Bearer là định nghĩa loại token dành riêng cho việc xác thực và uỷ quyền, tham khảo các loại token
        khác như: Basic token, Digest token, 0Auth token, ...
         */
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
})

/** Khởi tạo một cái promise cho việc gọi api refreshtoken
Mục đích tạo promise này để khi nhận yêu cầu refreshtoken đầu tiên thì hold lại việc api refresh_token 
cho tới khi xong xuôi thì mói retry lại những api bị lỗi trước đó thay vì cứ thế gọi refresh_token liên tục
với mỗi request lỗi.
 */
let refreshTokenPromise = null
// Add a response interceptor: Can thiệp vào những cái response nhận về từ API
authenrizedAxiosInstance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là success rơi vào đay
    // Do something with response data
    return response
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error rơi vào đay
    // Do something with response error

    //Khu vực quan trọng: xử lý refresh token tự động
    // Nếu như nhận mã 401 từ BE thì gọi API logout
    if (error.response?.status === 401) {
        handleLogoutAPI().then(()=>{
            // Nếu trường hợp dùng cookie thì xoá userInfo trong localstorage
            // localStorage.removeItem('userInfo')
            // Điều hướng về trang login use basic js
            location.href = '/login'
        })
    }
    // Nếu như nhận mã 410 từ BE thì sẽ gọi API refreshToken để làm mới accessToken
    // Đầu tiên lấy được các request APi đang bị lỗi thông quá error.config
    const originalRequest = error.config
    if (error.response?.status === 410 && originalRequest) {
        if (!refreshTokenPromise) {
            // Lấy refresh token từ localstorage (trong th localstorage)
            const refreshToken = localStorage.getItem('refreshToken')
            // Gọi API refresh token
            refreshTokenPromise = refreshTokenAPI(refreshToken)
                .then((res) => {
                    //Lấy và gán lại accesstoken vào localstorage (Cho th localstorage)
                    const { accessToken } = res.data
                    localStorage.setItem('accessToken', accessToken)
                    authenrizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`

                    //Đồng thời lưu ý là accesstoken cũng đã được update lại ở cookie(cho th cookie)
                    //...            
                })
                .catch((_error) => {
                    // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout ra luôn
                    handleLogoutAPI().then(() => {
                        // Nếu trường hợp dùng cookie thì xoá userInfo trong localstorage
                        // localStorage.removeItem('userInfo')

                        // Điều hướng về trang login use basic js
                        location.href = '/login'
                    })
                    return Promise.reject(_error)
                })
                .finally(() => { 
                    // Dù API refreshtoken có thành công hay lỗi thì luôn gán lại cái refreshTokenPromise = null như ban đầu
                    refreshTokenPromise = null
                })
        }
        // Cuối cùng mói return refreshTokenPromise trong TH success ở đây
        return refreshTokenPromise.then(() => {
            // Quan trọng: return lại axios instance của chúng ta kết hợp cái originalRequest
            // để gọi lại những api ban đầu bị lỗi
            return authenrizedAxiosInstance(originalRequest)
        })
    }
    /**
    Xử lý tập trung phần hiển thị thông báo lỗi trả về từ moị API ở đây 
    console.log error ra là sẽ thấy cấu trúc data dẫn đến message lỗi như dưới đây
    Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình, ngoại trừ lỗi 410 - gone phục vụ việc tự động
    refresh lại token
     */
    if(error.response?.status !== 410){
        toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
})

export default authenrizedAxiosInstance