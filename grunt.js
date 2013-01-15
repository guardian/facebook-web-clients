/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        meta: {
            version: '1.0',
            banner: "/* Facebook Web Clients <%= meta.version %> */"
        },
        watch: {
            files: ['src/*.js'],
            tasks: ['test']
        },
        concat: {
            banner: {
                src: ['<banner:meta.banner>', 'src/scripts/components/banner/*.js'],
                dest: 'static/facebook-banner-<%= meta.version %>.js'
            },
            authorizer: {
                src: ['<banner:meta.banner>', 'src/scripts/namespace.js', 'src/scripts/authorizer/*.js'],
                dest: 'static/facebook-authorizer-<%= meta.version %>.js'
            },
            voteComponentJS: {
                src: ['<banner:meta.banner>', 'src/scripts/namespace.js', 'src/scripts/eventemitter.js', 'src/scripts/util/bignumberformatter.js', 'src/scripts/components/vote/*.js'],
                dest: 'static/facebook-components-vote-<%= meta.version %>.js'
            },
            voteComponentJSIE: {
                src: ['<banner:meta.banner>', 'src/scripts/namespace.js', 'src/scripts/es5-shim.js', 'src/scripts/object.create.js', 'src/scripts/excanvas.js', 'src/scripts/eventemitter.js', 'src/scripts/util/bignumberformatter.js', 'src/scripts/components/vote/*.js'],
                dest: 'static/facebook-components-vote-ie-<%= meta.version %>.js'
            },
            voteComponentCSS: {
                src: ['<banner:meta.banner>', 'src/css/components/vote/*.css'],
                dest: 'static/facebook-components-vote-<%= meta.version %>.css'
            },
            voteComponentMicroApp: {
                src: ['<banner:meta.banner>', 'src/scripts/components/vote/microapp/*.js'],
                dest: 'static/facebook-components-vote-microapp-<%= meta.version %>.js'
            },
            donut: {
                src: ['<banner:meta.banner>', 'src/scripts/ui/donut/*.js'],
                dest: 'static/facebook-ui-donut-<%= meta.version %>.js'
            }
        },
        min: {
            banner: {
                src: ['<config:concat.banner.dest>'],
                dest: 'static/facebook-banner-<%= meta.version %>.min.js'
            },
            authorizer: {
                src: ['<config:concat.authorizer.dest>'],
                dest: 'static/facebook-authorizer-<%= meta.version %>.min.js'
            },
            voteComponentJS: {
                src: ['<config:concat.voteComponentJS.dest>'],
                dest: 'static/facebook-components-vote-<%= meta.version %>.min.js'
            },
            voteComponentJSIE: {
                src: ['<config:concat.voteComponentJSIE.dest>'],
                dest: 'static/facebook-components-vote-ie-<%= meta.version %>.min.js'
            },
            voteComponentMicroApp: {
                src: ['<config:concat.voteComponentMicroApp.dest>'],
                dest: 'static/facebook-components-vote-microapp-<%= meta.version %>.min.js'
            },
            donut: {
                src: ['<config:concat.donut.dest>'],
                dest: 'static/facebook-ui-donut-<%= meta.version %>.min.js'
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
