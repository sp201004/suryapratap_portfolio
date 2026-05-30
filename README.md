# Portfolio

A modern, responsive portfolio website built with HTML, CSS, and JavaScript. Features a clean design with smooth animations and interactive elements, showcasing my work as a Software Engineer at Amdocs and a Computer Science graduate from NIT Agartala.

🌐 **Live:** [surya-portfolio-blue.vercel.app](https://surya-portfolio-blue.vercel.app/)

## 🌟 Features

- **Modern UI Design**: Clean and professional interface with glassmorphism effects.
- **Interactive Elements**:
  - Particle.js background animations.
  - Typed.js for dynamic text display.
  - Smooth hover transitions.
  - Color-changing social icons.
- **Live LeetCode Stats**: Problems solved, contest rating, max rating, global rank, and Knight badge — fetched in real time.
- **Multi-page Layout**: Hero, About, Experience, Projects, Certifications, Skills, Resumes, Contact.
- **Responsive Layout**: Works seamlessly on desktop and mobile devices.
- **Fast Loading**: Optimized assets and minimal dependencies.
- **SEO Optimized**: Proper meta tags, per-page Open Graph URLs, and semantic HTML.
- **Analytics**: Google Analytics (gtag.js) integrated across all pages.

## 🛠️ Technologies Used

- HTML5
- CSS3 / Tailwind CSS (CDN)
- JavaScript
- [Particles.js](https://vincentgarreau.com/particles.js/) — Background animation
- [Typed.js](https://github.com/mattboldt/typed.js/) — Text animation
- [Bootstrap Icons](https://icons.getbootstrap.com/) — Social media icons
- LeetCode public APIs ([alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api), [coderme](https://coderme.vercel.app/), [leetcode-api-faisalshohag](https://github.com/faisalshohag/leetcode-api))

## 📁 Structure

```
docs/
  ├── index.html         # Hero
  ├── about.html         # About + Education + Skills + Certs + LeetCode + Resumes + Contact
  ├── experience.html    # Amdocs (mCloud, AIOps), NIC internship
  ├── projects.html      # Project showcase
  ├── 404.html           # Custom 404
  └── assets/
      ├── img/           # Project + logo images
      ├── styles.css     # Page styles
      ├── particles.js   # Particle background config
      ├── typed.js       # Typed-text helper
      └── leetcode-stats.js  # Live LeetCode stats updater
```

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/sp201004/suryapratap_portfolio.git
   ```
2. Navigate to the project directory:
   ```bash
   cd suryapratap_portfolio
   ```
3. Open `docs/index.html` directly in your browser, or run a quick static server:
   ```bash
   npx serve docs
   # or
   python3 -m http.server 8080 -d docs
   ```

## 🌐 Deployment

The site is deployed on **Vercel** with the `docs/` folder as the publish directory.

If you're deploying your own fork:

1. Import the repo into Vercel
2. Set **Root Directory** to `docs`
3. **Framework preset** = "Other" (no build command needed)
4. Deploy

The site is also compatible with GitHub Pages — just enable Pages on `/docs`.

## 🔄 Making Updates

1. Make changes to your local files.
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. Changes will auto-deploy to Vercel (or GitHub Pages, if configured).

## 📬 Contact

- **Email** — [sp01042002@gmail.com](mailto:sp01042002@gmail.com)
- **LinkedIn** — [suryapratapsingh1](https://www.linkedin.com/in/suryapratapsingh1/)
- **GitHub** — [sp201004](https://github.com/sp201004)
- **Portfolio** — [surya-portfolio-blue.vercel.app](https://surya-portfolio-blue.vercel.app/)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">
Built with ❤️ by Surya
</div>
