import bot from '/assets/bot.svg'
import user from '/assets/user.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container')


let loadInterval;




function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(()=>{
     element.textContent+='.';
     
    if(element.textContentxt  ===  '....') {
        element.textContent = '';
    }     

    },300)
}


function typeText(element, text ) {
    let index = 0;
    let interval = setInterval(()=>{
        if(index < text.lenght){
            element.innerHTML += text.charAt(intdex);
            index++;
        }else {
            clearInterval(interval);
        }
    },20)
}



function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}


function chatStrip (isAi,value,uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
        <div class="profile">
        <img 
        src ="${isAi ? bot :user}"
        alt="${isAi ? bot :user}"
        />
        </div>
        <div class ="message" id=${uniqueId}>${value}</div>
        </div>
        </div>
        `
    )
}


const handleSumbit = async (e) => {
    e.preventDefault();


    const data = new FormData(form);


    chatContainer.innerHTML +=chatStrip(false,data.get('prompt'));

    form.reset();

    const uniqueId = generateUniqueId();
    chatContainer.innerHTML +=chatStrip(true," ",uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);
  
    // fetch data from server ->bots resp

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';


    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();
        typeText(messageDiv,parsedData);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = "something wrong";

        alert(err);
    }
}


form.addEventListener('submit',handleSumbit);
form.addEventListener('keyup',(e)=>{
    if(e.keyCode === 13){
        handleSumbit(e);
    }
})