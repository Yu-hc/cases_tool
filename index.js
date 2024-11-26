import puppeteer from "puppeteer"
import { GoogleGenerativeAI } from "@google/generative-ai"

import fs from "fs"
import { PdfReader } from "pdfreader"
function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time)
	})
}
const isDemo = false;
async function readPdfToString(pdfPath) {
	return new Promise((resolve, reject) => {
		let pdfText = ""
		const reader = new PdfReader()
		reader.parseFileItems(pdfPath, (err, item) => {
			if (err) {
				reject(err)
			} else if (!item) {
				resolve(pdfText)
			} else if (item.text) {
				pdfText += item.text + " "
			}
		})
	})
}

async function extractDiagnosis(pdfFilePath) {
	// // Define the path of your PDF file
	let raw_text =
		"extract the diagnosis of the following medical record with array format\n"
	// Function to read PDF and convert to text
	await readPdfToString(pdfFilePath)
		.then((text) => {
			raw_text += text
		})
		.catch((err) => console.error("Error reading PDF:", err))

	const genAI = new GoogleGenerativeAI(process.env.API_KEY)
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

	const prompt = raw_text

	const result = await model.generateContent(prompt)
	// console.log(result.response.text())
    let rawOutput = result.response.text
    let diagnosis = []
    for(let i = 0; i < result.response.text().split('"').length; i++){
        if(i % 2 == 1)
            diagnosis.push(result.response.text().split('"')[i])
    }
	return diagnosis
}
async function crawlFromPubMed(diagnosis) {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	// Navigate the page to a URL.
	await page.goto("https://pubmed.ncbi.nlm.nih.gov")
	// Set screen size.
	await page.setViewport({ width: 1080, height: 1024 })

	// Type into search box.
	await page.locator("#id_term").fill(String(diagnosis))
	await page.keyboard.press("Enter")
	let abstracts = []
	for (let i = 0; i < 5; i++) {
		await page
			.locator(
				`#search-results > section.search-results-list > div.search-results-chunks > div > article:nth-child(${
					i + 3
				}) > div.docsum-wrap > div.docsum-content > a`
			)
			.click()
		let textSelector = await page.locator("#eng-abstract > p").waitHandle()
		let abstract = await textSelector?.evaluate((el) => el.textContent)
		abstracts[i] = abstract
		await page.goBack()
	}
	// console.log(abstracts)

	browser.close()
	return abstracts
}
async function summarizeAbstracts(abstracts) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY)
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

	const prompt = 'summarize the following research abstracts in bullet lists in html format with <h2> and <ul>\n' + abstracts
	const result = await model.generateContent(prompt)
	// console.log(result.response.text())
	return result.response.text()
}


let Diagnosis, Abstracts, Summary
await extractDiagnosis('./case/sample_case.pdf').then((diagnosis) => {Diagnosis = diagnosis})
console.log('Diagnosis', Diagnosis)
if(isDemo)
    await delay(5000)
for(let i = 0 ; i < Diagnosis.length; i++){
    await crawlFromPubMed(Diagnosis[i]).then((abstracts) =>{Abstracts = abstracts})
    console.log('Abstracts', Abstracts)
    if(isDemo)
        await delay(5000)
    await summarizeAbstracts(Abstracts).then((summary)=>{Summary = summary})
    const simpleCss = '<link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">'
    console.log('Summary', Summary)
    if(isDemo)
        await delay(5000)
    fs.writeFile(`./output/${Diagnosis[i]}.html`, Summary+simpleCss, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
