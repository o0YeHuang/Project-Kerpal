// JQuery-esque $ hack - less code
const $ = function (id) { return document.getElementById(id); };
// Constant relative paths for config and sound JSON's
const configURL = '/assets/config.json';
const soundsUrlA = 'assets/sounds/sounds-A.json';
const soundsUrlB = '/assets/sounds/sounds-B.json';

// Variables to help keep track of mode for icon or list view and also what
// the current soundboard is
let currentView = 'icon';
let currentBoard = 1;

// Variable to help keep track of xhr retries/timeouts
let xhrRetries = 0;

/*
  Function Name: showToast(msg)
  Description: Helper function that shows a Snackbar toast to the users
  Inputs: msg - string to show in snackbar
  Outputs: None - shows a message to user via the Snackbar
*/
function showToast(msg) {
  Snackbar.show({
    text: msg,
    pos: 'bottom-right',
    actionTextColor: 'red',
    backgroundColor: 'rgba(50,50,50, 0.7)',
    duration: 10000,
  });
}

/*
  Function Name: processConfig(config)
  Description: Helper function that processes the config.json file to
               dynamically populate themes and sounds menu dropwdowns
  Inputs: config - parsed config.json
  Outputs: None - populates themes and sounds dropdown menus
*/
function processConfig(config) {
  const optionTemplate = $('optionTemplate');
  const selectThemes = $('themeMenu').querySelector('select');
  const selectBoards = $('soundMenu').querySelector('select');
  // Iterate through all themes and append them to theme select tag
  for (let i = 0; i < config.themes.length; i += 1) {
    const theme = config.themes[i];
    const tmpOption = optionTemplate.content.cloneNode(true);
    tmpOption.querySelector('option').value = `theme${i}`;
    tmpOption.querySelector('option').innerText = theme;
    selectThemes.appendChild(tmpOption);
  }
  // Iterate through all soundboards and append them to soundboard select tag
  for (let i = 0; i < config.boards.length; i += 1) {
    const board = config.boards[i];
    const tmpOption = optionTemplate.content.cloneNode(true);
    tmpOption.querySelector('option').value = `board${i}`;
    tmpOption.querySelector('option').innerText = board;
    selectBoards.appendChild(tmpOption);
  }
}

/*
  Function Name: processSounds(sounds, url)
  Description: Helper function that processes the sounds json objects to
               dynamically populate the soundboards with the sounds and imgs
  Inputs: sounds - parsed soundsA.json or soundsB.json
  Outputs: None - populates the soundboard with sounds and images
*/
function processSounds(sounds, url) {
  // Local const variables
  const pauseImgSrc = 'assets/imgs/pause-button.svg';
  const playImgSrc = 'assets/imgs/play-button.svg';
  const soundboardOneIcon = $('soundboard-one-icon');
  const soundboardOneList = $('soundboard-one-list');
  const soundboardTwoIcon = $('soundboard-two-icon');
  const soundboardTwoList = $('soundboard-two-list');
  const soundTemplateIcon = $('soundTemplateIcon');
  const soundTemplateList = $('soundTemplateList');

  // Iterate through all the sounds and append them to the icon and list
  // soundboard versions. toggleView() will hide/unhide the other on click
  for (let i = 0; i < sounds.length; i += 1) {
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
    // Add play/pause button click for icon version soundboard sounds
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
    // Add play/pause button click for list version soundboard sounds
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
    // Append sounds to correct soundboard A or B, depending on the url
    if (url === soundsUrlA) {
      soundboardOneIcon.appendChild(tmpSoundIcon);
      soundboardOneList.appendChild(tmpSoundList);
    } else {
      soundboardTwoIcon.appendChild(tmpSoundIcon);
      soundboardTwoList.appendChild(tmpSoundList);
    }
  }
}

/*
  Function Name: boardChange()
  Description: Switches between the two sound boards
  Inputs: None
  Outputs: None
*/
function boardChange() {
  // Change soundboard to currently selected in soundboard menu
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

/*
  Function Name: themeChange()
  Description: Switches between the two themes of light and dark
  Inputs: None
  Outputs: None
*/
function themeChange() {
  // Change theme depending on what is currently selected in theme menu
  switch (this.options[this.selectedIndex].text) {
    case 'Light':
      $('themeStyle').href = 'assets/css/style_final.min.css';
      break;
    case 'Dark':
      $('themeStyle').href = 'assets/css/style-2_final.min.css';
      break;
    default: break;
  }
}

/*
  Function Name: toggleView()
  Description: Switches between the icon view and list view
  Inputs: None
  Outputs: None
*/
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

/*
  Function Name: createXHR()
  Description: Creates XMLHttpRequest Object depending on user's browser
  Inputs: None
  Outputs: returns XMLHttpRequest object for appropriate browser
*/
function createXHR() {
  try { return new XMLHttpRequest(); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e) { Raven.captureException(e); }
  try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) { Raven.captureException(e); }
  return null;
}

/*
  Function Name: handleData(xhr, url)
  Description: Method called in XHR's onreadystatechange callback
  Inputs: xhr - XMLHttpRequest Object, url - describes what was being fetched
  Outputs: None
*/
function handleData(xhr, url) {
  switch (xhr.status) {
    case 200:
      if (xhr.readyState === 4) {
        try {
          // parse JSON from xhr response
          const data = JSON.parse(xhr.response);
          if (url === configURL) {
            // process config.json
            processConfig(data);
          } else {
            // process soundsA.json or soundsB.json
            processSounds(data, url);
          }
        } catch (e) {
          if (url === configURL) {
            showToast('Sorry! There was an error processing the configurations. &#9785;');
          } else {
            showToast('Sorry! There was an error processing the sounds. &#9785;');
          }
          Raven.captureException(e);
        }
      }
      break;
    case 404:
      window.location.href = '/404.html';
      break;
    case 500:
      window.location.href = '/500.html';
      break;
    default:
      window.location.href = '/404.html';
      break;
  }
}

/*
  Function Name: getJSON(url)
  Description: Helper function that fetches JSON object (config or sounds json)
               depending on the url
  Inputs: url - Endpoint to fetch JSON from
  Outputs: None
*/
function getJSON(url) {
  const xhr = createXHR();
  if (xhr) {
    try {
      xhr.overrideMimeType('application/json');
      xhr.open('GET', url, true);
      xhr.timeout = 5000;
      xhr.ontimeout = function () {
        xhr.abort();
        if (xhrRetries < 3) {
          showToast('Kerpal server timed out. Trying again!');
          xhrRetries += 1;
          getJSON(url);
        } else {
          showToast('Aww shucks. Kerpal server still timed out after three attempts.');
        }
      };
      xhr.onreadystatechange = function () {
        xhrRetries = 0;
        handleData(xhr, url);
      };
      xhr.send(null);
    } catch (e) {
      Raven.captureException(e);
    }
  }
}

/*
  Function called when window has loaded.
  Sets up event listeners for dropdown menus and icon/list viw button
  Calls getJSON() for each of our required JSON files
*/
window.onload = function () {
  $('togBtn').addEventListener('click', toggleView);
  $('boards').addEventListener('change', boardChange);
  $('themes').addEventListener('change', themeChange);
  getJSON(configURL);
  getJSON(soundsUrlA);
  getJSON(soundsUrlB);
};
