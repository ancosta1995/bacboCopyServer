const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT, {
    cors: {
        origin: "*"
    }
});

const clients = new Set();
const token = 12345678;

io.on('connection', (socket) => {
    console.log('Uma nova extensão conectou.');
    clients.add(socket);

    socket.on('receiveBet', (data) => {
        if (data.token === token) { // Se o token for válido, propaga a mensagem para todos os outros clientes
            console.log(`Dados recebido de master: ${JSON.stringify(data)}`);

            socket.emit('receiveBetConfirmation', { status: true });

            socket.broadcast.emit('sendBet', data.bet);
        }
    });

    socket.on('disconnect', () => {
        console.log('Uma extensão se desconectou.');
        clients.delete(socket);
    });
});

console.log(`Servidor Socket.IO rodando na porta ${PORT}.`);