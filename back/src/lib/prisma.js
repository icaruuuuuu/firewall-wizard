import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from '../../database/generated/prisma/client.ts'
// import mysql from 'mysql2/promise'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: process.env.DATABASE_CONNECTION_LIMIT
})

// const pool = mysql.createPool({
//   host: process.env.DATABASE_HOST,    // Nome do container
//   port: process.env.DATABASE_PORT,
//   user: process.env.DATABASE_USER,     // NÃO pode ficar vazio
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
//   waitForConnections: true,
//   queueLimit: 0
// });

console.log(1, process.env.DATABASE_HOST)
console.log(2, process.env.DATABASE_USER)
console.log(3, process.env.DATABASE_PASSWORD)
console.log(4, process.env.DATABASE_NAME)

// const adapter = new PrismaMariaDb(pool)
const prisma = new PrismaClient({ adapter })

export default prisma
