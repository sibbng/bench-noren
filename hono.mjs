import { Hono } from 'hono'
import cluster from 'cluster'
import { cpus } from 'os'
import { serve } from '@hono/node-server'

const app = new Hono()
  
app.all('/', (c) => {
  return c.text("Hello")
})

if (cluster.isPrimary) {
  const numCPUs = cpus().length
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  serve({
    fetch: app.fetch,
    port: 3000
  })
}