const voiceMenuEl = document.getElementById('custom-input__voice-menu');
const textAreaEl = document.getElementById('custom-input__text-input');
const submitBtn = document.getElementById('custom-input__submit-btn');
const imageGridEl = document.getElementById('image-grid');
const settingsBtn = document.getElementById('main-header__settings-btn');
const overlay = document.getElementById('overlay');


const DEFAULT_LANGUAGE = 'Google UK English Male';

const data = [
	{
		image: "./img/drink.jpg",
		text: "I'm Thirsty",
	},
	{
		image: "./img/food.jpg",
		text: "I'm Hungry",
	},
	{
		image: "./img/tired.jpg",
		text: "I'm Tired",
	},
	{
		image: "./img/hurt.jpg",
		text: "I'm Hurt",
	},
	{
		image: "./img/happy.jpg",
		text: "I'm Happy",
	},
	{
		image: "./img/angry.jpg",
		text: "I'm Angry",
	},
	{
		image: "./img/sad.jpg",
		text: "I'm Sad",
	},
	{
		image: "./img/scared.jpg",
		text: "I'm Scared",
	},
	{
		image: "./img/outside.jpg",
		text: "I Want To Go Outside",
	},
	{
		image: "./img/home.jpg",
		text: "I Want To Go Home",
	},
	{
		image: "./img/school.jpg",
		text: "I Want To Go To School",
	},
	{
		image: "./img/grandma.jpg",
		text: "I Want To Go To Grandmas",
	},
];



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

data.forEach(createCell);



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
		message.voice = voices.find(voice => voice.name === DEFAULT_LANGUAGE);
  });
};

const setVoice = (e) => message.voice = voices.find(voice => voice.name === e.target.value);



// ===== Event listeners ===== //
settingsBtn.addEventListener('click', showSettings);
speechSynthesis.addEventListener('voiceschanged', getVoices);
voiceMenuEl.addEventListener('change', setVoice);
submitBtn.addEventListener('click', readInputBox);
imageGridEl.addEventListener('click', readImageBox);
window.addEventListener('DOMContentLoaded', () => {
	getVoices();
	setVoice();
});

