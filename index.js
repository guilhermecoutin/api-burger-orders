const express = require('express');
const uuid = require('uuid');

const app = express();
app.use(express.json());

const orders = [];

const checkOrderId = (request, response, next) => {
    const { id } = request.params;

    const index = orders.findIndex( item => item.id === id);

    if (index < 0) {
        return response.status(404).json({error:"Order not found!"});
    }

    request.orderId = id;
    request.orderIndex = index;

    next()
}

app.get('/order', (request, response) => {
    return response.json(orders);
});

app.post('/order', (request, response) => {
    const { order, clientName, price } = request.body;

    const orderClient = {id: uuid.v4(), order, clientName, price, status:"Em preparação"};
    
    orders.push(orderClient);

    return response.status(201).json(orderClient);
});

app.put('/order/:id', checkOrderId, (request, response) => {
    const { order, clientName, price } = request.body;
    const id = request.orderId;
    const index = request.orderIndex;

    const updatedOrder = {id, order, clientName, price, status:"Em preparação"};

    orders[index] = updatedOrder;

    return response.json(updatedOrder);
})

app.delete('/order/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex;

    orders.splice(index, 1);

    return response.json(orders);
})

app.get('/order/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex;

    return response.json(orders[index]);
})

app.patch('/order/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex;

    orders[index].status = "Pronto";

    return response.json(orders[index]);
})


app.listen(3000, () => {
    console.log('🚀 Server started on port');
});