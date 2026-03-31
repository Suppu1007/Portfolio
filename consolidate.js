const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const about = fs.readFileSync('pages/about.html', 'utf8');
const projects = fs.readFileSync('pages/projects.html', 'utf8');
const resume = fs.readFileSync('pages/resume.html', 'utf8');
const contact = fs.readFileSync('pages/contact.html', 'utf8');

function extractMain(html) {
    const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    return match ? match[1] : '';
}

// Extract scripts too, especially the contact form and AI chatbot logic!
function extractScripts(html) {
    // Only capture inline scripts ignoring main.js
    const scriptRegex = /<script>(?src)([\s\S]*?)<\/script>/g;
    let scripts = '';
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
        if (!scripts.includes(match[1].trim().substring(0, 20))) {
            scripts += match[1] + '\n';
        }
    }
    return scripts;
}

let newMain = extractMain(index);
newMain += '\n\n<div id="about" style="scroll-margin-top: 100px;"></div>\n' + extractMain(about);
newMain += '\n\n<div id="projects" style="scroll-margin-top: 100px;"></div>\n' + extractMain(projects);
newMain += '\n\n<div id="resume" style="scroll-margin-top: 100px;"></div>\n' + extractMain(resume);
newMain += '\n\n<div id="contact" style="scroll-margin-top: 100px;"></div>\n' + extractMain(contact);

let combinedScripts = extractScripts(index) + extractScripts(contact);

let newIndex = index.replace(/<main[^>]*>[\s\S]*?<\/main>/, `<main class="portfolio-wrapper">\n${newMain}\n</main>`);
// Inject combined scripts before closing body
newIndex = newIndex.replace(/<script src="\/assets\/js\/main\.js"><\/script>\s*([\s\S]*?)<\/body>/, `<script src="/assets/js/main.js"></script>\n<script>\n${combinedScripts}\n</script>\n</body>`);

fs.writeFileSync('index.html', newIndex);
console.log("Successfully consolidated all HTML files into index.html");
