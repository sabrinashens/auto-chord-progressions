const playBeatsButton = document.getElementById('playBeats');
beatsState = false;

playBeatsButton.addEventListener('click', function () {
	const selectetBeats = document.getElementById('beats').value;
    if (selectetBeats == "2") {
      document.getElementById('chords1').style.visibility = "visible";
      document.getElementById('chords2').style.visibility = "visible";
      document.getElementById('chords3').style.visibility = "hidden";
      document.getElementById('chords4').style.visibility = "hidden";
    }
    else if (selectetBeats == "3") {
      document.getElementById('chords1').style.visibility = "visible";
      document.getElementById('chords2').style.visibility = "visible";
      document.getElementById('chords3').style.visibility = "visible";
      document.getElementById('chords4').style.visibility = "hidden";
    }
    else if (selectetBeats == "4") {
      document.getElementById('chords1').style.visibility = "visible";
      document.getElementById('chords2').style.visibility = "visible";
      document.getElementById('chords3').style.visibility = "visible";
      document.getElementById('chords4').style.visibility = "visible";
    }
})

document.addEventListener("DOMContentLoaded", function (event) {

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var clicksGain = {};
    var beatsGain = {};
   
    playBeatsButton.addEventListener("click", function () {
        if (beatsState == false) {	
            tempo = document.getElementById('tempo').value / 80;
            beatsNum = document.getElementById('beats').value; 
            
            playClicks();
            playBeats();
            
            beatsState = true;
		}
        else if (beatsState == true) {
			clicksGain.gain.cancelScheduledValues(audioCtx.currentTime);
			beatsGain.gain.cancelScheduledValues(audioCtx.currentTime);
        	
            beatsState = false;
        }
    })
    
    function playClicks() {
        const osc = audioCtx.createOscillator();
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, audioCtx.currentTime);

        for (let i = 0; i < 200; i++) {
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime + i/tempo + 0.05);
            gain.gain.setTargetAtTime(0.02, audioCtx.currentTime + i/tempo + 0.05, 0.02);
            gain.gain.setValueAtTime(0, audioCtx.currentTime + i/tempo + 0.07);
            gain.gain.setTargetAtTime(0, audioCtx.currentTime + i/tempo + 0.07, 1/tempo - 0.07); 
        }
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        
        clicksGain = gain;
    }
    
    function playBeats() {
        const osc = audioCtx.createOscillator();
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
             
        for (let i = 0; i < 200; i++) {
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime + beatsNum*i/tempo + 0.05);
            gain.gain.setTargetAtTime(0.05, audioCtx.currentTime + beatsNum*i/tempo + 0.05, 0.02);
            gain.gain.setValueAtTime(0, audioCtx.currentTime + beatsNum*i/tempo + 0.07);
            gain.gain.setTargetAtTime(0, audioCtx.currentTime + beatsNum*i/tempo + 0.07, beatsNum/tempo - 0.07); 
        }
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        
        beatsGain = gain;
    }
    
    let wave = 'sine';
    var waveform = document.getElementById("Waveforms").waveform;
    for (var i = 0; i < waveform.length; i++) {
    	waveform[i].onclick = function() {
        	wave = this.value;
        }
    }
    
    //pitchMap
    //function playChords() {}
})

