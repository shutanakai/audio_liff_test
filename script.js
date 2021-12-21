// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

// load some sound
const audioElement = document.getElementsByTagName('audio');
let track1, track2;

const playButton = document.querySelector('.tape-controls-play');

// play pause audio
playButton.addEventListener('click', function() {
  if(!audioCtx) {
		init();
	}

	// check if context is in suspended state (autoplay policy)
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	if (this.dataset.playing === 'false') {
		audioElement[0].play();
		this.dataset.playing = 'true';
	// if track is playing pause it
	} else if (this.dataset.playing === 'true') {
		audioElement[1].play();
		this.dataset.playing = 'false';
	}

	let state = this.getAttribute('aria-checked') === "true" ? true : false;
	this.setAttribute( 'aria-checked', state ? "false" : "true" );

}, false);

// if track ends
audioElement.addEventListener('ended', () => {
	playButton.dataset.playing = 'false';
	playButton.setAttribute( "aria-checked", "false" );
}, false);

function init() {

	audioCtx = new AudioContext();
	track1 = audioCtx.createMediaElementSource(audioElement[0]);
	track2 = audioCtx.createMediaElementSource(audioElement[1]);

	// volume
	const gainNode = audioCtx.createGain();

	const volumeControl = document.querySelector('[data-action="volume"]');
	volumeControl.addEventListener('input', function() {
		gainNode.gain.value = this.value;
	}, false);

	// panning
	const pannerOptions = { pan: 0 };
	const panner = new StereoPannerNode(audioCtx, pannerOptions);

	const pannerControl = document.querySelector('[data-action="panner"]');
	pannerControl.addEventListener('input', function() {
		panner.pan.value = this.value;
	}, false);

	// connect our graph
	track1.connect(gainNode).connect(panner).connect(audioCtx.destination);
	track2.connect(gainNode).connect(panner).connect(audioCtx.destination);
}
