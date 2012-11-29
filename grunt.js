/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        meta:{
            version:'1.0',
            banner:"/* Facebook Web Clients <%= meta.version %> */"
        },
        concat:{
            dist:{
                src:['<banner:meta.banner>', 'src/namespace.js', 'src/*.js'],
                dest:'static/facebook-web-clients-<%= meta.version %>.js'
            }
        },
        min:{
            dist:{
                src:['<config:concat.dist.dest>'],
                dest:'static/facebook-web-clients-<%= meta.version %>.min.js'
            }
        },
        qunit: {
            all: ['test/tests.html']
        },
        server: {
            port: 8099,
            base: '.'
        }
    });

    grunt.registerTask('default', 'concat min');
    grunt.registerTask('test', 'default server qunit');

};
