const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const puppeteer = require('puppeteer');

async function generate() {
  const mdPath = path.join(__dirname, '..', 'docs', 'CONSOLIDATED_DOCUMENTATION_BRANDED.md');
  const outPdf = path.join(__dirname, '..', 'docs', 'CONSOLIDATED_DOCUMENTATION_BRANDED.pdf');
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(2);
  }
  const mdText = fs.readFileSync(mdPath, 'utf8');
  const md = new MarkdownIt({ html: true });
  const body = md.render(mdText);

  const docsDir = path.join(__dirname, '..', 'docs');
  const docsDirFileUrl = 'file:///' + docsDir.replace(/\\/g, '/') + '/';

  // Use template if available
  const templatePath = path.join(docsDir, 'pdf_template.html');
  let html;
  if (fs.existsSync(templatePath)) {
    let template = fs.readFileSync(templatePath, 'utf8');
    template = template.replace('{{content}}', body);
    const generatedDate = new Date().toLocaleString();
    template = template.replace('{{generatedDate}}', generatedDate);
    // Ensure base href points to docs dir so relative images load
    html = template.replace('<base href="./" />', `<base href="${docsDirFileUrl}" />`);
  } else {
    html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${docsDirFileUrl}"><style>body{font-family:Arial,Helvetica,sans-serif;margin:40px}</style></head><body>${body}</body></html>`;
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
    await page.pdf({ path: outPdf, format: 'A4', printBackground: true, margin: { top: '140px', bottom: '80px', left: '40px', right: '40px' } });
    console.log('PDF written to', outPdf);
  } finally {
    await browser.close();
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
