const socket = io();

// DOM
const form = document.getElementById('chat-form');
const inputTextArea = document.getElementById('textArea');
inputTextArea.disabled = true;
const modalForm = document.getElementById('modal-form');
const inputUsername = document.getElementById('inputNickName');
const modal = document.getElementById('modal-container');
const historyContainer = document.getElementById('chat-history');

// Utils
const toggleModal = () => {
    modal.classList.toggle('display-none');
};
const clientTime = (msgDate) => {
    const date = new Date(msgDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

//SweetAlert
Swal.fire({
    title: "Identificación",
    input: "text",
    text: "Por favor ingresa su email",
    inputValidator: (value) => {
        return !value.trim() && "Por favor ingresa su email!";
    },
    allowOutsideClick: false,
}).then((result) => {
    inputTextArea.disabled = false;
    username = result.value;
    //console.log(username);
    document.getElementById("inputNickName").innerHTML = username;
});



// Bring chat history on connection:
const autoScroll = () => {
    historyContainer.scrollTo({
        top: historyContainer.scrollHeight,
        behavior: 'smooth'
    });
};
socket.on('history', (data) => {
    data.forEach((msg) => {
        let currentMsg = `
        <div class="msg">
            <h4 class="msg-owner">${msg.user} dice: ${msg.message}, HORA:${clientTime(msg.time)}</h4> 
        </div>`;
        historyContainer.innerHTML += currentMsg;
    });
    autoScroll();
});
// Send message workflow:
// Actions
const sendMessage = (username) => {
    const currentMessage = inputTextArea.value;
    socket.emit('message', {
        user: username,
        text: currentMessage
    });
};
// Listeners
// Submit button
form.addEventListener('submit', (data) => {
    data.preventDefault();
    sendMessage(username);
    form.reset();
});
// enter
inputTextArea.addEventListener('keydown', (data) => {
    if (data.key === 'Enter' && !data.shiftKey) {
        data.preventDefault();
        sendMessage(username);
        form.reset();
    };
});
// Recive latest message:
socket.on('currentMessage', (msg) => {
    if (msg.user === username) {
        let currentMsg = `
        <div class="msg">
            <h4 class="msg-owner">${msg.user} dice: ${msg.message}, HORA:${clientTime(msg.time)}</h4> 
        </div>`;
        historyContainer.innerHTML += currentMsg;
        autoScroll();
    } else {
        let currentMsg = `
        <div class="msg">
            <h4 class="msg-owner">${msg.user} dice: ${msg.message}, HORA:${clientTime(msg.time)}</h4> 
        </div>`;
        historyContainer.innerHTML += currentMsg;
    };
});