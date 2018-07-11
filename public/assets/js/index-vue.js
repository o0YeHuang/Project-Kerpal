const $ = function (id) { return document.getElementById(id); };
const configURL = 'https://kerpal-f0ee5.firebaseapp.com/assets/config.json';
const soundsUrlA = 'https://kerpal-f0ee5.firebaseapp.com/assets/sounds/sounds-A.json';
const soundsUrlB = 'https://kerpal-f0ee5.firebaseapp.com/assets/sounds/sounds-B.json';
const pauseImgSrc = 'assets/imgs/pause-button.svg';
const playImgSrc = 'assets/imgs/play-button.svg';

let currentView = 'icon';
let currentBoard = 1;
let currentTheme = 1;
window.onload = function () {
  $('togBtn').addEventListener('click', () => {
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
    $('togBtn').classList.toggle('active');
  });
};

Vue.component('sound-icon', {
  template: `
    <div class="sound">
      <div class="soundImg">
        <img :src="sound.imgSrc" :alt="sound.imgAlt"/>
        <div class="soundButton">
          <button class="playPauseBtn" type="button" v-on:click="buttonClick">
            <img class="playpauseButtonImg" src="assets/imgs/play-button.svg" alt="Play/Pause"/>
            <audio :src="sound.soundSrc"></audio>
          </button>
        </div>
      </div>
      <h3>{{sound.title}}</h3>
    </div>
  `,
  props: ['sound'],
  methods: {
    buttonClick() {
      const soundWave = this.$el.getElementsByTagName('audio')[0];
      const btnImg = this.$el.getElementsByTagName('img')[1];
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
    },
  },
});
Vue.component('sound-list', {
  template: `
    <div class="sound-list">
      <div class="soundImg-list">
        <img class="list-img" :src="sound.imgSrc" :alt="sound.imgAlt"/>
        <div class="soundButton">
          <button class="playPauseBtn" type="button" v-on:click="buttonClick">
            <img class="playpauseButtonImg" src="assets/imgs/play-button.svg" alt="Play/Pause"/>
            <audio :src="sound.soundSrc"></audio>
          </button>
        </div>
      </div>
      <div>
        <h3>{{sound.title}}</h3>
      </div>
    </div>
  `,
  props: ['sound'],
  methods: {
    buttonClick() {
      const soundWave = this.$el.getElementsByTagName('audio')[0];
      const btnImg = this.$el.getElementsByTagName('img')[1];
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
    },
  },
});
const configVue = new Vue({
  el: '#menus',
  data: {
    themes: [],
    boards: [],
  },
  created() {
    this.getJSON(configURL, this.processConfig, 'config.json');
  },
  methods: {
    getJSON(url, processFunction, desc) {
      try {
        axios.get(url)
          .then((response) => {
            // console.log(response.data);
            const data = response.data;
            processFunction(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        Raven.captureException(e);
      }
    },
    boardChange() {
      switch ($('boards').options[$('boards').selectedIndex].text) {
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
    },
    themeChange() {
      console.log('hello');
      switch ($('themes').options[$('themes').selectedIndex].text) {
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
    },
    processConfig(config, desc) {
      this.themes = config.themes.slice(0);
      this.boards = config.boards.slice(0);
      console.log(this.themes);
      console.log(this.boards);
    },
  },
});
const soundVueOne = new Vue({
  el: '#soundboard-one',
  data: {
    soundsA: [],
  },
  created() {
    this.getJSON(soundsUrlA, this.processSounds, 'sounds-A.json');
  },
  methods: {
    getJSON(url, processFunction, desc) {
      try {
        axios.get(url)
          .then((response) => {
            console.log(response.data);
            const data = response.data;
            this.soundsA = data.slice(0);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        Raven.captureException(e);
      }
    },
  },
});
const soundVueTwo = new Vue({
  el: '#soundboard-two',
  data: {
    soundsB: [],
  },
  created() {
    this.getJSON(soundsUrlB, this.processSounds, 'sounds-B.json');
  },
  methods: {
    getJSON(url, processFunction, desc) {
      try {
        axios.get(url)
          .then((response) => {
            console.log(response.data);
            const data = response.data;
            this.soundsB = data.slice(0);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        Raven.captureException(e);
      }
    },
  },
});
