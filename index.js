require("dotenv").config()
const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
// const fs = require("fs")
const ObjectsToCsv = require("objects-to-csv")

//PRABHU CAPITAL LIMITED (12600)")
async function main () {
try{
const browser = await puppeteer.launch({headless:false})
const page = await browser.newPage();
await page.goto("https://meroshare.cdsc.com.np/#/login")
await page.waitForTimeout(7000)
//select doesnot work properly
// await page.select(".select2-hidden-accessible","")


await page.type("input#username.form-control.ng-untouched.ng-pristine.ng-invalid",process.env.USERNAME)
await page.type("input#password.form-control.ng-untouched.ng-pristine.ng-invalid",process.env.PASSWORD)

await page.click("button.btn.sign-in");
await page.waitForNavigation()
await page.goto("https://meroshare.cdsc.com.np/#/portfolio")

await page.waitForSelector("table")
const content = await page.content();
const $ = await cheerio.load(content);

const scrapeData = []
$("#main>div>app-my-portfolio>div>div:nth-child(2)>div>div>table>tbody>tr").each((index,element) => {
    // if(index === 0) return true;
    const tds = $(element).find("td")
    const hash = $(tds[0]).text()
    const scrip = $(tds[1]).text()
    const currentBalance = $(tds[2]).text()
    const  previousClosingPrice = $(tds[3]).text()
    const valuePreviousClosingPrice = $(tds[4]).text()
    const lastTransactionPrice = $(tds[5]).text()
    const valueLastTransactionPrice = $(tds[6]).text()

const dataObj = {hash,
    scrip,
    currentBalance,
    previousClosingPrice,
    valuePreviousClosingPrice,
    lastTransactionPrice,
    valueLastTransactionPrice}

scrapeData.push(dataObj)
    // console.log($($(element).find("tr")[0]).text())
})

console.log(scrapeData)
csvFile(scrapeData)
}catch(e){
    console.log(e)
}
}

const csvFile = async (scrapeData) => {

const csv = new ObjectsToCsv(scrapeData)
await csv.toDisk("./data.csv")

}

main()
