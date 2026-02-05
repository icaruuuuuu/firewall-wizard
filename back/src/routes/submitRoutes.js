import { Router } from 'express'
import All from '../models/All.js'
import { build } from '../lib/buildConfig.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import fs from 'fs'
import path from 'path'

const router_submit = Router()

router_submit.get('/submit', async (req, res) => {

	const TEMP = '/tmp'
	const data = await All.readAll()
	const config = build(data)
	
	const file = path.join(TEMP, 'app.conf')
	fs.writeFile(file, config, (error) => {
		if (error) {
			res.status(500).send('Failed to submit configuration: ', error)
		} else {
			res.status(200).json({})
		}
	});

})

export { router_submit }

// const config = await All.readAll()
// console.log(config)
