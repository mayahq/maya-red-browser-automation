const Scrape = require('./scrape.schema')

const scrapeNode = new Scrape()
const fn = (RED) => scrapeNode.config(RED)
module.exports = fn