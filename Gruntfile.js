module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'components/jquery/dist/', src: ['jquery.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/requirejs/', src: ['require.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/requirejs-text/', src: ['text.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/backbone/', src: ['backbone.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/underscore/', src: ['underscore.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/paper/dist/', src: ['paper-full.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/bootstrap/js', src: ['modal.js'], dest: 'public/scripts/libraries/'},
					{expand: true, cwd: 'components/bootstrap/less', src: ['*.less'], dest: 'public/styles/bootstrap/'},
					{expand: true, cwd: 'components/bootstrap/fonts', src: ['*'], dest: 'public/fonts/'}
				]
			}
		},
		exec: {
			npm: {
				command: 'npm update'
			},
			bower: {
				command: './node_modules/.bin/bower update'
			},
			mongod: {
				command: 'mongod -f /usr/local/etc/mongod.conf'
			}
		},
		jshint: {
			files: ['*.js', '!node_modules/**', 'public/scripts/*.js', 'public/scripts/**/*.js', '!public/scripts/libraries/**', '!public/scripts/<%= pkg.name %>.min.js'],
			options: {
				globals: {
					console: true,
					module: true,
					trailing: true
				}
			}
		},
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					"public/styles/style.css": "public/styles/style.less"
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					paths: { requireLib: 'libraries/require' },
					include: [ "requireLib" ],
					baseUrl: "public/scripts/",
					mainConfigFile: "public/scripts/app.js",
					name: "app",
					optimize: "uglify2",
					out: "public/scripts/<%= pkg.name %>.min.js"
				}
			}
		},
		env: {
			dev: { BUILD_ENV: 'DEVELOPMENT' },
			dist: { BUILD_ENV: 'PRODUCTION' }
		},
		preprocess: {
			index: { src: 'public/index.tpl', dest: 'public/index.html' },
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					ignoredFiles: ['components/**', 'node_modules/**'],
					watchedExtensions: ['js'],
					env: {
						PORT: '3000'
					},
					cwd: __dirname
				}
			}
		},
		watch: {
			files: ['public/**', '*.js', "public/styles/*.less", "!public/styles/*.css", '!public/index.html'],
			tasks: ['lint', 'process', 'less']
		},
		concurrent: {
			dev: {
				tasks: ['exec:mongod', 'nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// load libs
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-preprocess');

	// building task
	grunt.registerTask('build', ['exec:npm', 'exec:bower', 'copy']);

	// linting task
	grunt.registerTask('lint', ['jshint']);

	// process task
	grunt.registerTask('process', ['env:dev', 'preprocess:index']);

	// run task
	grunt.registerTask('run', ['concurrent']);

	// default task
	grunt.registerTask('default', ['lint', 'less', 'process', 'run']);

	// heroku task
	grunt.registerTask('heroku', ['exec:bower', 'copy', 'lint', 'less', 'requirejs', 'env:dist', 'preprocess:index']);
};
