import Server from 'noren/node'; 
import cluster from 'cluster';
import os from 'os';
const app = new Server ();
app.all ( '/', ( req, res ) => {
    res.body = "Hello"
    return res.end()
} );
if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart the worker
    });
} else {
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}