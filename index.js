#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const path = require('path')
const recursive = require("recursive-readdir")
const mdConverter = require('widdershins')
const yaml = require('js-yaml')
const shins = require('shins');

const widdershins_options = {
  "codeSamples": true,
  "customApiKeyValue": "ApiKey",
  "discovery": false,
  "expandBody": false,
  "headings": 2,
  "httpsnippet": false,
  "includes": [],
  // "jsonEditor": true,
  // "jsonEditorOptions": {
  //     "disableProperties": false,
  //     "disableEditJson": false,
  //     "removeEmptyProperties": true,
  //     "noDefaultProperties": false
  // },
  "lang": false,
  "language_tabs": [
      { "shell" :"cURL" },
      { 'http': 'HTTP' },
      { "javascript": "JavaScript" },
      { "python": "Python" },
      { "ruby": "Ruby" },
      { 'java': 'Java' }
  ],
  "maxDepth": 10,
  "omitBody": false,
  "outfile": "",
  "raw": false,
  "resolve": false,
  "search": true,
  "shallowSchemas": true,
  "theme": "sunburst",
  "tocSummary": false,
  "user_templates": "",
  "verbose": true,
  "yaml": false
}

const shins_options = {
  // if true, missing files will trigger an exit(1)
  cli: false,
  minify: false,
  customCss: false,
  inline: false,
  // setting to true turns off markdown sanitisation
  unsafe: false,
  // if true, do not automatically convert links in text to anchor tags
  'no-links': false
  // used to resolve relative paths for included files
  //source = filename,
  // logo: './resources/logo.png',
  // Link to apply to the logo
  // 'logo-url': 'https://www.example.com'
}

program
  .arguments('<surceswaggerfile> <targethtmlpath>')
  .option('-d, --debug <debuglevel>', 'The debug level')
  .option('-i, --include <fileList>', 'List of files to include, comma separated')
  .action(function(source, target, include, debug) {
    sourceFile = path.resolve(source)
    targetPath = path.resolve(target)
    // includeFile = './examples/api_2.yaml'
  })
  .parse(process.argv)

function readSourceFile(file) {
  console.log('[INFO] Reading : %s', file)
  var result = {}
  var s = fs.readFileSync(path.resolve(file),'utf8')
  try {
      result = {}
      result.sourceFile = file
      result.sourceContent = yaml.safeLoad(s,{json:true})
      return result
  }
  catch(ex) {
      console.error('[WARNING] Failed to parse YAML/JSON : %s', file)
      console.error(ex.message)
      return ''
  }
}

function convertToMarkDown(input, widdershins_options, shins_options) {
  console.log('[INFO] Converting : %s', input.sourceFile)
  // options.codeSamples = true
  // options.sample = true
  // console.error('[INFO] includeFile: %s', includeFile[0])
  // if (includeFile) options.includes = includeFile[0]
  mdConverter.convert(input.sourceContent,widdershins_options,function(err,output){
    if (err) {
      console.error('[WARNING] Error convertToMarkDown: %s', err)
      input.markdown = ''
    }
    console.log('[INFO] Converted to MD: %s', input.sourceFile)
    input.markdown = output
    convertToHtml(input, shins_options)
  })
  return input

}

function writeTargetFile(input) {
  input.targetFile = targetPath + input.sourceFile.replace(sourceFile, '').replace('.yaml','.html')
  console.log('[INFO] Writing : %s', input.targetFile)
  try {
    fs.writeFileSync(path.resolve(input.targetFile),input.html,'utf8')
  } catch (err) {
    console.error('[WARNING] Error writeTargetFile: %s', err)
  } finally {
    console.log('[INFO] Finish : %s', input.targetFile)
  }
}

function convertToHtml(input, options) {
  console.log('[INFO] convertToHtml : %s', input.sourceFile)
  shins.render(input.markdown, options, (err, html) => {
    if (err) {
      console.error('[WARNING] Error convertToHtml: %s', err)
      return;
    }
    input.html = html
    writeTargetFile(input)
  });
}

convertToMarkDown( readSourceFile(sourceFile), widdershins_options, shins_options )

// recursive(sourceFile, [(f,s) => !s.isDirectory() && path.extname(f) != ".yaml"])
//   .then(
//     files => files
//         .map(readSourceFile)
//         .map(convertToMarkDown)
//     ,
//     error => console.error("something exploded", error)
//   )
