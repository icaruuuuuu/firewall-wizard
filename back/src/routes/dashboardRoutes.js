import { Router } from 'express'
import DashboardService from '../models/Dashboard.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router_dashboard = Router()
router_dashboard.get('/db', isAuthenticated, async (req, res) => {
  try {
    const db = await DashboardService.readAllResources()
    return res.json(db)
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
    return res.status(500).json({ error: 'Erro ao carregar dados do dashboard' })
  }
})

export { router_dashboard }
