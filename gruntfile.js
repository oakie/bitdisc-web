'use strict';

module.exports = function(grunt) {
  grunt.config.set('watch', {
    grunt: {
      files: ['gruntfile.js']
    },
    bitdisc_js: {
      files: ['client/js/**/*.js'],
      tasks: ['build-dev:js']
    },
    bitdisc_css: {
      files: ['client/css/**/*.css'],
      tasks: ['build-dev:css']
    },
    bitdisc_html: {
      files: ['client/html/**/*.html'],
      tasks: ['build-dev:html']
    }
  });

  grunt.config.set('browserify', {
    app: {
      src: ['client/js/app.js', 'tmp/templates.js'],
      dest: 'public/js/bundle.js',
      options: {
        options: {
          transform: ['browserify-shim']
        },
        watch: true,
        browserifyOptions: {
          debug: false
        }
      }
    }
  });
  
  grunt.config.set('uglify', {
    options: {
      banner: '/*! Grunt Uglify <%= grunt.template.today("yyyy-mm-dd") %> */ ',
      mangle: false
    },
    app: {
      src: 'public/js/bundle.js',
      dest: 'public/js/bundle.min.js'
    }
  });

  grunt.config.set('concat_css', {
    options: {},
    all: {
      src: ['node_modules/bootstrap/dist/css/bootstrap.css', 'node_modules/font-awesome/css/font-awesome.css', 'client/css/**/*.css'],
      dest: 'public/css/bundle.css'
    }
  });

  grunt.config.set('cssmin', {
    bitdisc: {
      files: {
        'public/css/bundle.min.css': ['public/css/bundle.css']
      }
    }
  });

  grunt.config.set('copy', {
    bitdisc: {
      files: [{
        expand: true,
        cwd: 'client',
        src: ['img/**', 'html/index.html'],
        dest: 'public/'
      }, {
        expand: true,
        cwd: 'node_modules/bootstrap/dist',
        src: ['fonts/**'],
        dest: 'public/'
      }, {
        expand: true,
        cwd: 'node_modules/font-awesome',
        src: ['fonts/*'],
        dest: 'public/'
      }]
    }
  });

  grunt.config.set('html2js', {
    options: {
      rename: function(name) {
        return name.replace('../client/html/', '');
      }
    },
    bitdisc: {
      src: ['client/html/**.html', '!client/html/index.html'],
      dest: 'tmp/templates.js'
    }
  });

  grunt.config.set('nodemon', {
    start: {
      script: 'app.js',
      watch: ['app.js']
    }
  });

  grunt.config.set('concurrent', {
    target: {
      tasks: ['nodemon:start', ['build-dev:html', 'build-dev:css', 'watch']],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.config.set('build-prod', {js: 'js', css: 'css', html: 'html'});
  grunt.config.set('build-dev', {js: 'js', css: 'css', html: 'html'});

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerMultiTask('build-prod', function() {
    switch(this.target) {
      case 'js':
        grunt.task.run(['browserify', 'uglify']); break;
      case 'css':
        grunt.task.run(['concat_css', 'cssmin']); break;
      case 'html':
        grunt.task.run(['html2js', 'build-prod:js', 'copy']); break;
    }
  });
  grunt.registerMultiTask('build-dev', function() {
    switch(this.target) {
      case 'js':
        grunt.task.run(['browserify']); break;
      case 'css':
        grunt.task.run(['concat_css']); break;
      case 'html':
        grunt.task.run(['html2js', 'build-dev:js', 'copy']); break;
    }
  });
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('prod', ['build-prod:html', 'build-prod:css'])
};
