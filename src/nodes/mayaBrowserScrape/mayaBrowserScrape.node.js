const Scrape = require('./mayaBrowserScrape.schema')

const scrapeNode = new Scrape()
const fn = (RED) => scrapeNode.config(RED)
module.exports = fn