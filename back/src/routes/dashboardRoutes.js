export { router_dashboard }

import { Router } from 'express'
import DashboardService from '../models/Dashboard.js'

const router_dashboard = Router()

router_dashboard.get('/db', (req, res) => {
  const db = DashboardService.readAllResources()
  return res.json(db)
})
