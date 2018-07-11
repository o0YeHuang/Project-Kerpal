const $ = function (id) { return document.getElementById(id); };
let currentView = 'icon';
let currentBoard = 1;
let currentTheme = 1;

function boardChange() {
  switch (this.options[this.selectedIndex].text) {
    case 'Movies':
      currentBoard = 1;
      $('soundboard-two-icon').className = 'hideBoard';
      $('soundboard-two-list').className = 'hideBoard';
      if (currentView === 'list') {
        $('soundboard-one-list').className = 'soundboard-list';
        $('soundboard-one-icon').className = 'hideBoard';
      } else {
        $('soundboard-one-list').className = 'hideBoard';
        $('soundboard-one-icon').className = 'soundboard';
      }
      break;
    case 'South Park':
      currentBoard = 2;
      $('soundboard-one-icon').className = 'hideBoard';
      $('soundboard-one-list').className = 'hideBoard';
      if (currentView === 'list') {
        $('soundboard-two-list').className = 'soundboard-list';
        $('soundboard-two-icon').className = 'hideBoard';
      } else {
        $('soundboard-two-list').className = 'hideBoard';
        $('soundboard-two-icon').className = 'soundboard';
      }
      break;
    default: break;
  }
}

function themeChange() {
  switch (this.options[this.selectedIndex].text) {
    case 'Light':
      currentTheme = 1;
      $('themeStyle').href = 'assets/css/style.min.css';
      break;
    case 'Dark':
      currentTheme = 1;
      $('themeStyle').href = 'assets/css/style-2.min.css';
      break;
    default: break;
  }
}

function createXHR() {
  try { return new XMLHttpRequest(); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) { Raven.captureException(e); }
  return null;
}

function getJSON(xhr, url, handleFunction, desc) {
  if (xhr) {
    try {
      xhr.overrideMimeType('application/json');
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function () { handleFunction(xhr, desc); };
      xhr.send(null);
    } catch (e) {
      Raven.captureException(e);
    }
  }
}

function processConfig(config) {
  const optionTemplate = $('optionTemplate');
  const selectThemes = $('themeMenu').querySelector('select');
  const selectBoards = $('soundMenu').querySelector('select');
  for (let i = 0; i < config.themes.length; i++) {
    const theme = config.themes[i];
    const tmpOption = optionTemplate.content.cloneNode(true);
    tmpOption.querySelector('option').value = `theme${i}`;
    tmpOption.querySelector('option').innerText = theme;
    selectThemes.appendChild(tmpOption);
  }
  for (let i = 0; i < config.boards.length; i++) {
    const board = config.boards[i];
    const tmpOption = optionTemplate.content.cloneNode(true);
    tmpOption.querySelector('option').value = `board${i}`;
    tmpOption.querySelector('option').innerText = board;
    selectBoards.appendChild(tmpOption);
  }
}

function handleConfigJSON(xhr, desc) {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(desc);
    const config = JSON.parse(xhr.response);
    processConfig(config);
  } else {
    Raven.captureMessage('XHR Response Error', {
      level: 'error',
      extra: {
        readyState: xhr.readyState,
        status: xhr.status,
      },
    });
  }
}

function processSounds(sounds, desc) {
  const pauseImgSrc = 'assets/imgs/pause-button.svg';
  const playImgSrc = 'assets/imgs/play-button.svg';
  const soundboardOneIcon = $('soundboard-one-icon');
  const soundboardOneList = $('soundboard-one-list');
  const soundboardTwoIcon = $('soundboard-two-icon');
  const soundboardTwoList = $('soundboard-two-list');
  const soundTemplateIcon = $('soundTemplateIcon');
  const soundTemplateList = $('soundTemplateList');

  for (let i = 0; i < sounds.length; i++) {
    const sound = sounds[i];
    const tmpSoundIcon = soundTemplateIcon.content.cloneNode(true);
    const tmpSoundList = soundTemplateList.content.cloneNode(true);
    tmpSoundIcon.querySelector('.soundImg > img').src = sound.imgSrc;
    tmpSoundList.querySelector('.soundImg-list > img').src = sound.imgSrc;
    tmpSoundIcon.querySelector('.soundImg > img').alt = sound.imgAlt;
    tmpSoundList.querySelector('.soundImg-list > img').alt = sound.imgAlt;
    tmpSoundIcon.querySelector('audio').src = sound.soundSrc;
    tmpSoundList.querySelector('audio').src = sound.soundSrc;
    tmpSoundIcon.querySelector('h3').innerText = sound.title;
    tmpSoundList.querySelector('h3').innerText = sound.title;
    tmpSoundIcon.querySelector('button').addEventListener('click', function () {
      const soundWave = this.getElementsByTagName('audio')[0];
      const btnImg = this.getElementsByTagName('img')[0];
      if (soundWave.paused) {
        soundWave.play();
        btnImg.src = pauseImgSrc;
        btnImg.style.visibility = 'visible';
      } else {
        soundWave.pause();
        btnImg.src = playImgSrc;
        btnImg.style.visibility = 'hidden';
      }
      soundWave.onended = function () {
        btnImg.src = playImgSrc;
        btnImg.style.visibility = 'hidden';
      };
    }, false);
    tmpSoundList.querySelector('button').addEventListener('click', function () {
      const soundWave = this.getElementsByTagName('audio')[0];
      const btnImg = this.getElementsByTagName('img')[0];
      if (soundWave.paused) {
        soundWave.play();
        btnImg.src = pauseImgSrc;
        btnImg.style.visibility = 'visible';
      } else {
        soundWave.pause();
        btnImg.src = playImgSrc;
        btnImg.style.visibility = 'hidden';
      }
      soundWave.onended = function () {
        btnImg.src = playImgSrc;
        btnImg.style.visibility = 'hidden';
      };
    }, false);
    if (desc === 'sounds-A.json') {
      soundboardOneIcon.appendChild(tmpSoundIcon);
      soundboardOneList.appendChild(tmpSoundList);
    } else {
      soundboardTwoIcon.appendChild(tmpSoundIcon);
      soundboardTwoList.appendChild(tmpSoundList);
    }
  }
}

function handleSoundsJSON(xhr, desc) {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.response);
    const sounds = JSON.parse(xhr.response);
    processSounds(sounds, desc);
  } else {
    Raven.captureMessage('XHR Response Error', {
      level: 'error',
      extra: {
        readyState: xhr.readyState,
        status: xhr.status,
      },
    });
  }
}

function toggleView() {
  if ($('viewText').textContent === 'Icon View') {
    $('viewText').innerText = 'List View';
    currentView = 'list';
    if (currentBoard === 1) {
      $('soundboard-one-icon').className = 'hideBoard';
      $('soundboard-one-list').className = 'soundboard-list';
    } else {
      $('soundboard-two-icon').className = 'hideBoard';
      $('soundboard-two-list').className = 'soundboard-list';
    }
  } else {
    $('viewText').innerText = 'Icon View';
    currentView = 'icon';
    if (currentBoard === 1) {
      $('soundboard-one-icon').className = 'soundboard';
      $('soundboard-one-list').className = 'hideBoard';
    } else {
      $('soundboard-two-icon').className = 'soundboard';
      $('soundboard-two-list').className = 'hideBoard';
    }
  }
  this.classList.toggle('active');
}

window.onload = function () {
  $('togBtn').addEventListener('click', toggleView);
  $('boards').addEventListener('change', boardChange);
  $('themes').addEventListener('change', themeChange);
  const configURL = 'https://kerpal-f0ee5.firebaseapp.com/assets/config.json';
  const soundsUrlA = 'https://kerpal-f0ee5.firebaseapp.com/assets/sounds/sounds-A.json';
  const soundsUrlB = 'https://kerpal-f0ee5.firebaseapp.com/assets/sounds/sounds-B.json';
  const configXhr = createXHR();
  const soundsXhrA = createXHR();
  const soundsXhrB = createXHR();
  getJSON(configXhr, configURL, handleConfigJSON, 'config.json');
  getJSON(soundsXhrA, soundsUrlA, handleSoundsJSON, 'sounds-A.json');
  getJSON(soundsXhrB, soundsUrlB, handleSoundsJSON, 'sounds-B.json');
};
