module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		exec: {
			npm: {
				command: 'npm update'
			},
			mongod: {
				command: 'mongod -f /usr/local/etc/mongod.conf'
			}
		},
		jshint: {
			files: ['*.js', '!node_modules/**'],
			options: {
				globals: {
					console: true,
					module: true,
					trailing: true
				}
			}
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
		concurrent: {
			dev: {
				tasks: ['exec:mongod', 'nodemon'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// load libs
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-exec');

	// building task
	grunt.registerTask('build', ['exec:npm']);

	// linting task
	grunt.registerTask('lint', ['jshint']);

	// run task
	grunt.registerTask('run', ['concurrent']);

	// default task
	grunt.registerTask('default', ['lint', 'run']);
};
