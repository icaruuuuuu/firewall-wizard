export { router_dashboard }

import { Router } from 'express'
import DashboardService from '../models/Dashboard.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_dashboard = Router()

router_dashboard.use(authMiddleware)

router_dashboard.get('/db', async (req, res) => {
  const db = await DashboardService.readAllResources()
  return res.json(db)
})
