const mozjpeg = require('imagemin-mozjpeg');

module.exports = function (grunt) {
  grunt.initConfig({
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()], // Example plugin usage
        },
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/assets/imgs/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public/assets/imgs/',
        }],
      },
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/assets/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/assets/css/',
          ext: '.min.css',
        }],
      },
    },
  });
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['imagemin']);
};
