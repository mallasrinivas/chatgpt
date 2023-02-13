import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatcontianer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
   element.textContent = ''
   loadInterval = setInterval(()=>{
    element.textContent +='.';
    if(element.textContent === '....'){
      element.textContent ='';
    }
   },300)
}

function typetext(element,text){
  let index = 0;

  let interval = setInterval(()=>{
  if(index < text.length){
    element.innerHTML += text.charAt(index);
    index ++;
  } else {
    clearInterval(interval);
  }
  },20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAt,value,uniqueId){
  return (
    
    `
    <div class="wrapper ${isAt && 'ai'}">
     <div class="chat">
       <div class="profile">
        <img  src ="${isAt ? bot : user}"
        alt ="${isAt ? 'bot':'user'}"
        />
       </div>
       <div class ="message" id=${uniqueId}>
       ${value}
       </div>
     </div>
    </div>
    `
  )
}

const handleSubmit = async (ev) =>{
  ev.preventDefault();

  const data = new FormData(form);

  //user chartstripe
  chatcontianer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot chatstripe
  const uniqueID = generateUniqueId();
  chatcontianer.innerHTML += chatStripe(true, "",uniqueID);

  chatcontianer.scrollTop = chatcontianer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID);

  loader(messageDiv);
  //fetch data from serve
  const response = await fetch('http://localhost:4000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
  clearInterval(loadInterval);
  messageDiv.innerHTML = ''

  if(response.ok){
    const data = await response.json();
    const pareseData = data.bot.trim();
    typetext(messageDiv,pareseData)
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong"
    alert(err)
  }
}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(ev)=>{
  if(ev.keyCode === 13){
    handleSubmit(ev);
  }
});
