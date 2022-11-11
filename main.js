const playButton = document.getElementById('play');
const confirmButton = document.getElementById('confirm');
playState = false;

confirmButton.addEventListener('click', function () {
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
    var chordsGain = {};
   
    playButton.addEventListener("click", function () {
        if (playState == false) {	
            tempo = document.getElementById('tempo').value / 80;
            beatsNum = document.getElementById('beats').value; 
            
            playClicks();
            playBeats();
            selectedChords(); 
            
            document.getElementById('play').style.backgroundColor = "black";
            document.getElementById('play').style.color = "white"; 
            playState = true;
		}
        else if (playState == true) {
          clicksGain.gain.cancelScheduledValues(audioCtx.currentTime);
          beatsGain.gain.cancelScheduledValues(audioCtx.currentTime);
          chordsGain.gain.cancelScheduledValues(audioCtx.currentTime);
      
          document.getElementById('play').style.backgroundColor = "white";
          document.getElementById('play').style.color = "black"; 
        	playState = false;
        }
    })
    
    function playClicks() {
        const osc = audioCtx.createOscillator();
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, audioCtx.currentTime);

        for (let i = 0; i < 200; i++) {
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime + i/tempo + 0.05);
            gain.gain.setTargetAtTime(0.01, audioCtx.currentTime + i/tempo + 0.05, 0.02);
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
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + beatsNum*i/tempo + 0.05);
            gain.gain.setTargetAtTime(0.1, audioCtx.currentTime + beatsNum*i/tempo + 0.05, 0.02);
            gain.gain.setValueAtTime(0, audioCtx.currentTime + beatsNum*i/tempo + 0.07);
            gain.gain.setTargetAtTime(0, audioCtx.currentTime + beatsNum*i/tempo + 0.07, beatsNum/tempo - 0.07); 
        }
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        
        beatsGain = gain;
    }
    
    ////////////////////////////////////////////////////////    
    
    const notePitch = {
    "C": 60,
    "C#": 61,
    "D": 62,
    "D#": 63,
    "E": 64,
    "F": 65,
    "F#": 66,
    "G": 67,
    "G#": 68,
    "A": 69,
    "A#": 70,
    "B": 71,
    }
    
    function selectedChords() {
    
        const firstRoot = notePitch[document.getElementById("firstNote").value];     
        const secondRoot = notePitch[document.getElementById("secondNote").value];
        const thirdRoot = notePitch[document.getElementById("thirdNote").value];
        const fourthRoot = notePitch[document.getElementById("fourthNote").value];
        
        const firstChord = document.getElementById("firstChord").value;
        const secondChord = document.getElementById("secondChord").value; 
        const thirdChord = document.getElementById("thirdChord").value;  
        const fourthChord = document.getElementById('fourthChord').value; 

        var first = chordsComp(firstRoot, firstChord);
        var second = chordsComp(secondRoot, secondChord);
        var third = chordsComp(thirdRoot, thirdChord);
        var fourth = chordsComp(fourthRoot, fourthChord);  
        
        if (first.length < 1) {
			document.getElementById('enter1').innerHTML = "--Please select--";
        }
        else {
        	document.getElementById('enter1').innerHTML = "";
        	playChords(first);
        }
        
        if (second.length < 1) {
			document.getElementById('enter2').innerHTML = "--Please select--";
        }
        else {
        	document.getElementById('enter2').innerHTML = "";
        	playChords(midiToFreq(second[1]));
        }
        if (third.length < 1) {
			document.getElementById('enter3').innerHTML = "--Please select--";
        }
        else {
        	document.getElementById('enter3').innerHTML = "";
        	playChords(midiToFreq(third[1]));
        }
        if (fourth.length < 1) {
			document.getElementById('enter4').innerHTML = "--Please select--";
        }
        else {
        	document.getElementById('enter4').innerHTML = "";
        	playChords(midiToFreq(fourth[1]));
        } 
    }
    
    function chordsComp(root,chords) {
    	sequence = [];
    	if (chords === "major") {
        	sequence.push(root, root + 4, root + 7);
        }
        else if (chords === "minor") {
        	sequence.push(root, root + 3, root + 7);
        }
        else if (chords === "dim") {
        	sequence.push(root, root + 3, root + 6);
        }
        else if (chords === "aug") {
        	sequence.push(root, root + 4, root + 8);
        }
        return sequence;
    }
    
    function midiToFreq(m) {
        return Math.pow(2, (m - 69) / 12) * 440;
    }
   
    let wave = 'sine';
    var waveform = document.getElementById("Waveforms").waveform;
    for (var i = 0; i < waveform.length; i++) {
    	waveform[i].onclick = function() {
        	wave = this.value;
        }
    }

    function playChords(sequence) {
        const osc = audioCtx.createOscillator();
        osc.type = wave;
        osc.frequency.value = midiToFreq(sequence[1])
        
        const gain = audioCtx.createGain();
        for (let i = 0; i < 200; i++) {
        	gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.8, audioCtx.currentTime + beatsNum*i/tempo + 0.01);
            gain.gain.setTargetAtTime(0.65, audioCtx.currentTime + beatsNum*i/tempo + 0.01, 0.5);
            gain.gain.setValueAtTime(0, audioCtx.currentTime + beatsNum*i/tempo + 0.51);
            gain.gain.setTargetAtTime(0, audioCtx.currentTime + beatsNum*i/tempo + 0.51, beatsNum/tempo - 0.51); 
        }
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
 
        chordsGain = gain;
    }



})

