const express = require('express');
const path = require('path');

const app = express();
app.use(
  require("prerender-node").set("prerenderToken", 'vPqZlZC6aAUv7VsRz2Xf')
  );
  app.use(express.static(path.join(__dirname, 'build')))
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
console.log(path.join(__dirname+'/build/index.html'))
  // Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

const port = process.env.PORT || 8080;

 app.listen(port, () => {
})