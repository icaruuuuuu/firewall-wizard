import { Router } from 'express'
import All from '../models/All.js'
import { build } from '../lib/buildConfig.js'
import { isAuthenticated } from '../middlewares/auth.js'
import fs from 'fs'
import path from 'path'

const router_submit = Router()
router_submit.get('/submit', isAuthenticated, async (req, res) => {

	const TEMP = '/tmp'
	const data = await All.readAll()
	const config = "#!/usr/sbin/nft -f\n\nflush ruleset\n\n" + build(data)

	const file = path.join(TEMP, 'nftables.conf')
	fs.writeFile(file, config, (error) => {
		if (error) {
			console.error('Erro ao enviar configuração:', error)
			res.status(500).send('Erro ao enviar configuração: ', error)
		} else {
			res.status(200).json({})
		}
	});

})

router_submit.get('/reset', isAuthenticated, async (req, res) => {

	const TEMP = '/tmp'
	const data = await All.readAll()
	const config = `#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
	type filter hook input priority filter;
    }
    chain forward {
	type filter hook forward priority filter;
    }
    chain output {
	type filter hook output priority filter;
    }
}`;

	const file = path.join(TEMP, 'nftables.conf')
	fs.writeFile(file, config, (error) => {
		if (error) {
			console.error('Erro ao resetar configuração:', error)
			res.status(500).send('Erro ao resetar configuração: ', error)
		} else {
			res.status(200).json({})
		}
	});
})

export { router_submit }
