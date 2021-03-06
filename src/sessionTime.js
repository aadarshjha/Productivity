const Timer = require('easytimer.js').Timer;
const timerPrompt = require('electron-prompt');
const localMem = new Memory();

let stop = false;

//local sesion counter;
let sessionCount = 0;

let timerInst = new Timer();


const initMessage = "No active session.";

function createSession(){
  //resetting just in case there was a previous session.

  //creating a session.
      prompt({
        title: 'Enter a Session name',
        label: 'Enter a name:',
        value: 'Enter Session Name here.',
        type: 'input'
    })
    .then((r) => {
        if(r != null) {


          if(sessionCount != 0){
            let initialText = document.getElementById('sessionName').innerText;
            //measures in hours minutes seconds.
            let timeMin = timerInst.getTimeValues().hours * 60 + timerInst.getTimeValues().minutes + (timerInst.getTimeValues().seconds/60);

            //creating an object: {time,sessionName}
            let dataObject = {time: timeMin, sessionName: initialText};

            //checking if the memory exists
            if(!localMem.has("sessionStore")){
              localMem.store("sessionStore", [dataObject]);
            } else {
              let array = localMem.get('sessionStore');
              array.push(dataObject);
              localMem.store('sessionStore', array);
            }

            //push to the graph.
            if(!stop){
              addData(initialText, timeMin);
            }
          }

          document.getElementById('sessionName').innerText = r;

          timerInst.reset();
          timerInst.start();
          sessionCount = sessionCount + 1;
          stop = false;
        }
    })
    .catch(console.error);

  timerInst.addEventListener('secondsUpdated', function(e){
    let elementTimer = document.getElementById('timer');
    elementTimer.innerText = timerInst.getTimeValues().toString();
  });
  //^updates DOM;

}

function stopSession(){

  if(sessionCount != 0 && !stop){
    let initialText = document.getElementById('sessionName').innerText;
    //measures in hours minutes seconds.
    let timeMin = timerInst.getTimeValues().hours * 60 + timerInst.getTimeValues().minutes + (timerInst.getTimeValues().seconds/60);

    //creating an object: {time,sessionName}
    let dataObject = {time: timeMin, sessionName: initialText};

    //checking if the memory exists
    if(!localMem.has("sessionStore")){
      localMem.store("sessionStore", [dataObject]);
    } else {
      let array = localMem.get('sessionStore');
      array.push(dataObject);
      localMem.store('sessionStore', array);
    }
    //stop timer.
    timerInst.pause();
    //push to the graph.
    addData(initialText, timeMin);
    stop = true;
  }
}

//listen to some buttons
const newButton = document.getElementById('new');
newButton.addEventListener('click', createSession);

const stopButton = document.getElementById('stop');
stopButton.addEventListener('click', stopSession);
