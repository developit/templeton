module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			main : {
				options : {
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
					sourceMap : true,
					report : 'min'
				},
				files : {
					'dist/templeton.min.js': [ 'templeton.js' ]
				}
			}
		},

		jshint : {
			options : {
				browser : true
			},
			main : [
				'templeton.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [
		'jshint:main',
		'uglify:main'
	]);

};
