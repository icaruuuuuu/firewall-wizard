import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  // verifica se veio o header Authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  // formato esperado: Bearer TOKEN
  const parts = authHeader.split(' ')

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token mal formatado' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' })
  }

  try {
    const decoded = jwt.verify(token, 'secret_key_firewallwizard')

    // opcional: salvar id do usuário na requisição
    req.userId = decoded.userId

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

export { authMiddleware }
