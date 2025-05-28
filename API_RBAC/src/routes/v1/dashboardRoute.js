// Author: TrungQuanDev: https://youtube.com/@trungquandev
import express from 'express'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { StatusCodes } from 'http-status-codes'
import { MOCK_ROLES_LEVEL_1 } from '~/models/mock_Database-Level-1'
import { rbacMiddleware_Level_1 } from '~/middlewares/rbacMiddleware-Level-1'
import { rbacMiddleware_Level_2 } from '~/middlewares/rbacMiddleware-Level-2'
import { rbacMiddleware_Level_3 } from '~/middlewares/rbacMiddleware-Level-3'

const Router = express.Router()

Router.route('/access')
  .get(authMiddleware.isAuthorized, dashboardController.access)
// Ví dụ api messages chỉ cho phép user có role là admin hoặc moderator truy cập
Router.route('/messages')
  .get(
    authMiddleware.isAuthorized,
    // rbacMiddleware_Level_1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN, MOCK_ROLES_LEVEL_1.MODERATOR]),
    // rbacMiddleware_Level_2.isValidPermission(['read_messages']), // read ứng với API GET
    rbacMiddleware_Level_3.isValidPermission(['read_messages']), // read ứng với API GET
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'Messages API' })
    }
  )
// Ví dụ api admin-tools chỉ cho phép user có role là admin truy cập
Router.route('/admin-tools')
  .get(
    authMiddleware.isAuthorized,
    // rbacMiddleware_Level_1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN]),
    // rbacMiddleware_Level_2.isValidPermission(['read_admin_tools']), // read ứng với API GET
    rbacMiddleware_Level_3.isValidPermission(['read_admin_tools']), // read ứng với API GET
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'admin-tools API' })
    }
  )
export const dashboardRoute = Router
