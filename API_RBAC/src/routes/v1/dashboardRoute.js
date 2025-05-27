// Author: TrungQuanDev: https://youtube.com/@trungquandev
import express from 'express'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { StatusCodes } from 'http-status-codes'
import { rbacMiddleware_Level_1 } from '~/middlewares/rbacMiddleware-Level-1.js'
import { MOCK_ROLES_LEVEL_1 } from '~/models/mock_Database-Level-1'

const Router = express.Router()

Router.route('/access')
  .get(authMiddleware.isAuthorized, dashboardController.access)
// Ví dụ api messages chỉ cho phép user có role là admin hoặc moderator truy cập
Router.route('/messages')
  .get(
    authMiddleware.isAuthorized,
    rbacMiddleware_Level_1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN, MOCK_ROLES_LEVEL_1.MODERATOR]),
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'Messages API' })
    }
  )
// Ví dụ api admin-tools chỉ cho phép user có role là admin truy cập
Router.route('/admin-tools')
  .get(
    authMiddleware.isAuthorized,
    rbacMiddleware_Level_1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN]),
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'admin-tools API' })
    }
  )
export const dashboardRoute = Router
