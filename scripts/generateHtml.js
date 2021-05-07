const path = require('path')
const fs = require('fs')
const { codegen } = require('@mayahq/module-sdk')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

function generateHtml(name) {
    const package = require(path.join(__dirname, '../package.json'))
    const nodepath = package.nodepath
    const targetPath = path.join(__dirname, '..', nodepath, `${name}/${name}.schema.js`)
    const htmlPath = path.join(__dirname, '..', nodepath, `${name}/${name}.node.html`)

    const NodeClass = require(targetPath)
    codegen(NodeClass, htmlPath)
}

function generateHtmlForAll() {
    const package = require(path.join(__dirname, '../package.json'))
    const nodepath = package.nodepath

    const targetDir = path.join(__dirname, '..', nodepath)
    const files = fs.readdirSync(targetDir)
    files.forEach((file) => generateHtml(file))
}

// generateHtmlForAll()

yargs(hideBin(process.argv))
    .command('gen-html [name]', 'Generate HTML file for a node', (yargs) => {
        return yargs.positional('name', {
            describe: 'node to generate HTML for'
        })
    }, (argv) => {
        console.log(argv)
        if (argv.name) {
            generateHtml(argv.name)
        } else {
            generateHtmlForAll()
        }
    })
    .argv