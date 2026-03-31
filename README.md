# Mathyam Supriya - Data Science & AI Portfolio

An elegant, high-performance portfolio showcasing my Data Science, Machine Learning, and Fullstack AI System projects. The design relies on a pure, modular vanilla HTML, CSS, and JS architecture optimized for fast load times and clean structure.

## 🚀 Live Demo
Deploying to **Vercel** via the `vercel.json` configuration included in this repository.

## 📁 Repository Structure
```text
/
├── index.html                # Introduction and Quick Profile
├── pages/                    # Sub-pages for the Portfolio
│   ├── about.html            # Full Detailed Profile & Education
│   ├── projects.html         # Projects Showcase (MediExplain, SCMLite, etc.)
│   ├── resume.html           # Dedicated Resume Page
│   └── contact.html          # Contact Links and Email 
├── assets/                   # Static Resources
│   ├── css/                  # Modular CSS system (layout, components, typography)
│   ├── js/                   # Vanilla Javascript for Dynamic Component Loading
│   └── docs/                 # Original Resume PDF
├── components/               # Pure HTML Partial Includes
│   ├── head.html
│   ├── navbar.html
│   └── footer.html
├── config/                   
│   └── site.json             # Global Site Metatag Values
└── vercel.json               # Deployment Settings & Routing Rules
```

## 🛠 Tech Stack Built On
- **Core:** Semantic HTML5, Vanilla JavaScript (ES6+), Modular CSS3 (No build step required).
- **Component Injection:** In-house lightweight fetch scripts handle multi-page navigation headers and footers smoothly.
- **Design System:** Inspired by high-end editorial magazines featuring Playfair Display and Inter font pairing with minimalist beige and paper-white canvas.

## 🔧 Local Development
To serve locally, you do not need Node.js or a bundler. You just need to run a simple HTTP server to allow the static fetch injections to operate:
```bash
# Using Python
python3 -m http.server 8000
```
Then visit `http://localhost:8000`

## 👤 Author
**Mathyam Supriya**  
*MS in Data Science | Fullstack AI Engineer*  
- [Email](mailto:mathyamsupriya@gmail.com)
- [LinkedIn](#)
- [GitHub](#)
