import { Router } from 'express'
import All from '../models/All.js'
import { build } from '../lib/buildConfig.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_submit = Router()

router_submit.get('/submit', async (req, res) => {

	try {
		const config = await All.readAll()
		console.log(build(config))
		return res.status(200).json({})
	} catch (error) {
		console.log("Failed to submit configuration: ", error)	
    		return res.status(500).json({ error: 'Failed to fetch table' })
	}
})

export { router_submit }

// const config = await All.readAll()
// console.log(config)
