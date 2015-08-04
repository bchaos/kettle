/*jshint node: true, evil: true */
'use strict';

var path = require('path');
var fs = require('fs');
var extend = require('util')._extend;
var coffeeScript = require('coffee-script');
var mkpath = require('mkpath');

function readOptions(content) {
  var firstLine = content.substr(0, content.indexOf('\n'));
  var match = /^\s*\/\/\s*(.+)/.exec(firstLine);
  var options = {};

  if (!match) {
    return options;
  }

  match[1].split(',').forEach(function (item) {
    var key, value, i = item.indexOf(':');
    if (i < 0) {
      return;
    }
    key = item.substr(0, i).trim();
    value = item.substr(i + 1).trim();
    if (value.match(/^(true|false|undefined|null|[0-9]+)$/)) {
      value = eval(value);
    }
    options[key] = value;
  });
  return options;
}

// makes a file in a path where directories may or may not have existed before
function mkfile(filepath, content, callback) {
  mkpath(path.dirname(filepath), function (err) {
    if (err) {
      return callback ? callback(err) : undefined;
    }
    fs.writeFile(filepath, content, callback);
  });
}

// compile the given less file
function compile(coffeeFile, defaults, callback) {

  fs.readFile(coffeeFile, function (err, buffer) {
    if (err) {
      return callback(err);
    }

    var content = buffer.toString();
    var options = extend(extend({}, defaults), readOptions(content));
    var coffeePath = path.dirname(coffeeFile);
    var jsFilename;
    var jsFile;

    // main is set: compile the referenced file instead
    if (options.main) {
      coffeeFile = path.resolve(coffeePath, options.main);
      return compile(coffeeFile, defaults, callback);
    }

    // out is null or false: do not compile
    if (options.out === null || options.out === false) {
      return callback();
    }

    // out is set: output to the given file name
    if (options.out) {
      jsFilename = options.out;
      if (path.extname(jsFilename) === '') {
        jsFilename += '.js';
      }
      delete options.out;
    } else {
      jsFilename = path.basename(coffeeFile);
      jsFilename = jsFilename.substr(0, jsFilename.length - path.extname(jsFilename).length) + '.js';
    }
    jsFile = path.resolve(coffeePath, jsFilename);

    // source map file name and url
//    if (options.sourceMap) {
//      options.sourceMap = {};
//      options.sourceMap.sourceMapURL = options.sourceMapURL;
//      options.sourceMap.sourceMapBasepath = options.sourceMapBasepath || lessPath;
//      options.sourceMap.sourceMapRootpath = options.sourceMapRootpath;
//      options.sourceMap.outputSourceFiles = options.outputSourceFiles;
//      options.sourceMap.sourceMapFileInline = options.sourceMapFileInline;
//      if (options.sourceMapFileInline) {
//        options.sourceMap.sourceMapFileInline = true;
//      } else {
//        if (options.sourceMapFilename) {
//          options.sourceMapFilename = path.resolve(lessPath, options.sourceMapFilename);
//        } else {
//          options.sourceMapFilename = cssFile + '.map';
//        }
//        if (!options.sourceMap.sourceMapURL) {
//          options.sourceMap.sourceMapURL = path.relative(cssFile + path.sep + '..', options.sourceMapFilename);
//        }
//      }
//    }

    // set the path
    options.paths = [coffeePath];
    options.filename = jsFile;
    // options.rootpath = lessPath;

    // plugins
    options.plugins = [];
    var js = coffeeScript.compile(content);
    mkfile(jsFile, js, function (err) {
        if (err) {
          return callback(err);
        }

        // write source map
//        if (output.map && options.sourceMapFilename) {
//          mkfile(options.sourceMapFilename, output.map, function (err) {
//            if (err) {
//              return callback(err);
//            }
//            callback(null, { filepath: cssFile, output: css });
//          });
//        } else {
//          callback(null, { filepath: cssFile, output: css });
//        }
    });
  });

}

// set up service for brackets
function init(DomainManager) {
  if (!DomainManager.hasDomain('CoffeeCompiler')) {
    DomainManager.registerDomain('CoffeeCompiler', { major: 1, minor: 0 });
  }
  DomainManager.registerCommand(
    'CoffeeCompiler', // domain name
    'compile', // command name
    compile, // command handler function
    true, // this command is asynchronous
    'Compiles a coffee-script file', ['coffeePath'], // path parameters
    null);
}

exports.init = init;
