/*
 * grunt-fontcustom
 * 
 *
 * Copyright (c) 2015 Zong
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('fontcustom', 'svg2iconfont', function() {

    var exec = require('child-process-promise').exec,
        fs = require('fs'),
        done = grunt.task.current.async(),
        tmpFolder = '.tmp/iconfont',
        _this = this;

    console.log(process.cwd());
    
    var option = {
      name : _this.data.name || 'fontcustom-iconfont',
      selector : _this.data.selector || '.icon-{{glyph}}',
      output : _this.data.output || 'iconfont-output',
      css : _this.data.css || 'iconfont.css',
      preview : _this.data.preview || 'preview.html'
    };

    var checkFontCustom = function(result){
      grunt.log.subhead('iconfont准备生成...');
      if(result.stderr){
        grunt.log.warn(result.stderr);
        return false;
      }
      grunt.log.oklns('fontcustom版本：' + result.stdout);

      var run = 'fontcustom compile' +
                ' ' + _this.data.input + // input svg
                ' -o ' + option.output + // tmp folder
                ' -n ' + option.name + // font name
                ' -S ' + option.selector + // css selector
                (_this.data.debug === 1 ? ' -D' : '') + // debug
                ' -h'; // no hash
      grunt.log.writeln('>> 运行： ' + run + "\n");

      // grunt.log.writeln('>>- 字体名：' + _this.data.name + '');
      // grunt.log.writeln('>>- SVG：' + _this.data.input + '/*.svg');
      // grunt.log.writeln(' -> 输出样式：' + _this.data.output.css);
      // grunt.log.writeln(' -> 输出字体：' + _this.data.output.fonts + '/'+_this.data.name+'.*');
      // grunt.log.writeln(' -> 输出预览：' + _this.data.output.preview + "\n");

      exec(run) //生成字体
        .then(makeIconFont)
        .fail(function(err){
          grunt.log.warn(err);
        });

    };

    var makeIconFont = function(result){
      if(_this.data.debug){grunt.log.writeln(result.stdout);}
      if(result.stderr){grunt.log.warn(result.stderr);}

      //验证文件
      if(!grunt.file.isPathInCwd('.fontcustom-manifest.json')){
        grunt.log.error('[失败] iconfont创建失败！');
        return;
      }

      //移动文件
      try{

        var cssFile = _this.data.output + '/' + _this.data.name + '.css';
        var previewFile = _this.data.output + '/' + _this.data.name + '-preview.html';
        grunt.log.writeln("      rename  " + cssFile + ' -> ' + _this.data.output + '/' + option.css);
        grunt.log.writeln("      rename  " + previewFile + ' -> ' + _this.data.output + '/' + option.preview);
        fs.renameSync(cssFile, _this.data.output + '/' + option.css);
        fs.renameSync(previewFile, _this.data.output + '/' + option.preview);
        
        //移动字体
        // grunt.file.copy('.tmp/iconfont/'+_this.data.name+'.ttf','.tmp/moveTest/'+_this.data.name+'.ttf',{});
        // grunt.file.copy('.tmp/iconfont/'+_this.data.name+'.svg','.tmp/moveTest/'+_this.data.name+'.svg',{});
        // grunt.file.copy('.tmp/iconfont/'+_this.data.name+'.woff','.tmp/moveTest/'+_this.data.name+'.woff',{});
        // grunt.file.copy('.tmp/iconfont/'+_this.data.name+'.eot','.tmp/moveTest/'+_this.data.name+'.eot',{});
        //移动样式
        // grunt.file.copy('.tmp/iconfont/'+_this.data.name+'.css','.tmp/moveTest/'+_this.data.name+'.css',{});
        //替换CSS路径
        //移动预览文件
      }catch(e){

      }

      //清理
      // grunt.file.delete(tmpFolder);
      grunt.file.delete('.fontcustom-manifest.json');

      grunt.log.oklns("iconfont生成完毕");
    };

    
    exec('fontcustom -v') //fontcustom测试
      .then(checkFontCustom)
      .fail(function(err){
        grunt.log.error('[失败] 请确认您已安装fontcustom，如未安装请前往 https://github.com/FontCustom/fontcustom/ 安装');
      });

  });

};