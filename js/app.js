// TODO - FIX: speech rate function
// TODO - FIX: in-/decrement input values function
// TODO - ADD: CRUD functionality
// TODO - ENHANCE: box shadow and button effects

import { http } from '/http.js';

const voiceMenuEl = document.getElementById('settings-form__voice-menu');
const textAreaEl = document.getElementById('custom-input__text-input');
const submitBtn = document.getElementById('custom-input__submit-btn');
const imageGridEl = document.getElementById('image-grid');
const settingsBtn = document.getElementById('main-header__settings-btn');
const overlay = document.getElementById('overlay');
const rangeInputs = document.querySelectorAll('.range-input-control__slider');

const DEFAULT_LANGUAGE = 'Google US English';


// ===== Populate grid ===== //
const createCell = (item) => {
  const div = document.createElement('div');
  const { image, text } = item;

  div.className = 'image-grid__cell';
  div.dataset.text = text;
  div.innerHTML = `
    <img src="${image}" alt="${text}"/>
    <p>${text}</p>
    <div class="img-overlay">
    </div>
    <i class="fa-solid fa-volume-high audio-icon"></i>
  `
  imageGridEl.appendChild(div);
};


const getImageSpeechData = () => {
	http
		.get('../../json/db.json')
		.then(data => data.forEach(createCell))
		.catch(error => console.error(error));
}


// ===== Input check & notify ===== //
const showNotification = (notification) => {
	const popup = document.getElementById('popup');
	if (notification === 'input-error') {
		popup.textContent = 'Please enter the text to be read';
	} else {
		return;
	}
	popup.classList.add('show');
	overlay.classList.add('show');
	setTimeout(() => {
		popup.classList.remove('show');
		overlay.classList.remove('show');
	}, 3500);
};

const validateForm = () => {
	if (textAreaEl.value === '') {
		showNotification('input-error');
		setTextMessage('You did not enter any text');
  	speakText();
	};
};



// ===== Open settings ===== //
const showSettings = () => {
	const settingsEl = document.getElementById('settings');
	const settingsCloseBtn = document.getElementById('settings-header__close-btn');
	settingsEl.classList.add('show');
	overlay.classList.add('show');
	settingsCloseBtn.onclick = () => {
		settingsEl.classList.remove('show');
		overlay.classList.remove('show');
	};

}



// ===== Speak text ===== // 
const message = new SpeechSynthesisUtterance;
const setTextMessage = (text) => message.text = text; 
const speakText = () => speechSynthesis.speak(message)

const readImageBox = (e) => {
  setTextMessage(e.target.parentElement.dataset.text);
  speakText();
};

const readInputBox = (e) => {
	e.preventDefault();
	validateForm();
  setTextMessage(textAreaEl.value);
  speakText();
};



// ===== Voices ===== //
let voices = [];

const getVoices = () => {
  voices = speechSynthesis.getVoices();
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
		voice.name === DEFAULT_LANGUAGE && (option.selected = true);
		// Capture group anything (.*) after "Google"
		const editName = () => /Google(.*)/.exec(voice.name)[1];
		option.textContent = `${editName()} ${voice.lang}`;
    voiceMenuEl.appendChild(option);
		setDefaultVoice();
  });
};

const setVoice = (e) => message.voice = voices.find(voice => voice.name === e.target.value);

const setDefaultVoice = () => message.voice = voices.find(voice => voice.name === DEFAULT_LANGUAGE);


// ===== Input slider ===== //
const handleInputChange = (e) => {
	const min = e.target.min;
	const max = e.target.max;
	const val = e.target.value;

	e.target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

	const inputValueText = e.target.parentElement.parentElement.children[0].children[1];
	inputValueText.textContent = val;

	changeVolume(e.target);
	changePitch(e.target);
	changeSpeed(e.target);
}

const changeVolume = (target) => {
	target.dataset.slider === 'volume' && (message.volume = target.value / 10);
};

const changePitch = (target) => {
	if (target.dataset.slider === 'pitch') {
		message.pitch = target.value * 0.2;
	};
};

const changeSpeed = (target) => {
	if (target.dataset.slider === 'speed') {
		// message.rate = target.value;
	};
};




// ===== Event listeners ===== //
settingsBtn.addEventListener('click', showSettings);
speechSynthesis.addEventListener('voiceschanged', getVoices);
voiceMenuEl.addEventListener('change', setVoice);
submitBtn.addEventListener('click', readInputBox);
imageGridEl.addEventListener('click', readImageBox);
rangeInputs.forEach(input => input.addEventListener('input', handleInputChange));
window.addEventListener('DOMContentLoaded', () => {
	getImageSpeechData();
	getVoices();
	setVoice();
});

