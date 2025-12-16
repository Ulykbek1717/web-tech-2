const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();

const PORT = 7777;


const filepath = path.join(__dirname, 'data.json');

function readData () {
    const data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
}

function writeData (data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

app.use(express.json());


app.get('/', (request, response) => {
    response.send('Server is running')
});

app.get('/hello', (request, response) => {
    response.json({message: "Hello from server!"})
});

app.get('/time', (request, response) => {
    const currentTime = new Date().toLocaleDateString();
    response.send(`current server time ${currentTime}`)
});

app.get('/status', (request, response) => {
    response.status(200).json({status: "OK", message: "Server is up and running!"})
});



app.get('/products', (request, response) => {
  const data = readData(); 
  response.json(data.products); 
});

app.post('/products', (request, response) => {
    const data = readData();
    
    if (!request.body || !request.body.name){
        return response.status(400).json({error: "Product name is required"});
    }

    const newProduct = {
        id: Date.now(),
        name: request.body.name,
        price: request.body.price || 0
    }

    data.products.push(newProduct);

    writeData(data);
    return response.status(201).json({ "Product added successfully": newProduct});
    
    
});

app.put('/products/:id', (request, response) => {
    const data = readData();

    if (!request.body) {
        return response.status(400).json({error: "Request body is required"});
    }

    const id = Number(request.params.id);
    const {name, price} = request.body;

    const productIndex = data.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
        return response.status(404).json({message: "Product not found"});
    }

    data.products[productIndex].name = name || data.products[productIndex].name;
    
    if (price !== undefined) {
        data.products[productIndex].price = price;
    }

    writeData(data);

    response.json({message: "Product updated successfully", product: data.products[productIndex]});
});

app.delete('/products/:id', (request, response) => {
  const id = Number(request.params.id); 

  const data = readData(); 
  const productIndex = data.products.findIndex(product => product.id === id); 

  if (productIndex === -1) {
    return response.status(404).json({ message: 'Product not found' }); 
  }

  data.products.splice(productIndex, 1);

  writeData(data);

  response.json({ success: true });
});



app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
});