import { Router } from 'express'
import All from '../models/All.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_submit = Router()

router_submit.get('/submit', (req, res) => {
	// const config = await All.readAll()
	// console.log(config)
})

const config = await All.readAll()
console.log(config)
