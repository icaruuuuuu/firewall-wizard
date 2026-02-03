import { Router } from 'express'
import DashboardService from '../models/Dashboard.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_dashboard = Router()

// router_dashboard.use(authMiddleware)

router_dashboard.get('/db', authMiddleware, async (req, res) => {
  try {
    const db = await DashboardService.readAllResources()
    return res.json(db)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load dashboard data' })
  }
})

export { router_dashboard }
