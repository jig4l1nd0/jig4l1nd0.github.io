# jig4l1nd0.github.io : Personal Website & Research Portfolio
Personal space in the web; projects, experiences and thoughts

Welcome to my personal website built with GitHub Pages. This site serves as both a professional portfolio showcasing my research, programming, and artistic projects, as well as a personal knowledge management system for organizing my academic and professional development.

## 🌐 Live Site
[https://tu-usuario.github.io](https://tu-usuario.github.io)

## ✨ Features

### Public Sections
- **Portfolio**: Research, programming, and artistic projects
- **About**: CV, experience, and professional background
- **Notes**: Public study notes and documentation with LaTeX support
- **Contact**: Professional contact information

### Private Sections
- **Dashboard**: Personal organization hub (password protected)
- **Goals**: Life and career planning tracker
- **Timeline**: Academic and professional development timeline

### Technical Features
- 📱 Responsive design with theme switching
- 🔢 LaTeX/Math rendering with KaTeX
- 🌍 Multi-language support (English primary, expandable)
- 🔐 Client-side authentication for private sections
- 🎨 Modular CSS architecture for easy customization

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Math Rendering**: KaTeX
- **Styling**: Modular CSS with CSS Custom Properties
- **Hosting**: GitHub Pages
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
├── index.html                 # Homepage
├── pages/
│   ├── about.html            # CV & Experience
│   ├── projects/             # Project portfolios
│   │   ├── index.html        # Projects overview
│   │   ├── research.html     # Research projects
│   │   ├── programming.html  # Programming projects
│   │   └── art.html         # Artistic projects
│   ├── notes/               # Public study notes
│   │   ├── index.html       # Notes hub
│   │   └── topics/          # Individual topics
│   └── private/             # Protected personal sections
│       ├── dashboard.html   # Personal dashboard
│       ├── goals.html       # Goals & planning
│       └── timeline.html    # Personal timeline
├── assets/
│   ├── css/
│   │   ├── main.css         # Base styles & variables
│   │   ├── components/      # Modular components
│   │   ├── themes/          # Light/dark themes
│   │   └── utilities.css    # Utility classes
│   ├── js/
│   │   ├── main.js          # Core functionality
│   │   ├── auth.js          # Authentication system
│   │   ├── latex-renderer.js # KaTeX configuration
│   │   └── theme-switcher.js # Theme management
│   └── images/              # Assets and media
├── config/
│   ├── latex-config.js      # LaTeX rendering settings
│   └── style-config.css     # Customizable CSS variables
└── data/
    └── content.json         # Content management
```

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/tu-usuario/tu-usuario.github.io.git
cd tu-usuario.github.io

# Serve locally (choose one option)
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx serve .

# Option 3: Live Server (VS Code extension)
# Just open index.html and use Live Server
```

Open `http://localhost:8000` in your browser.

## 🔧 Customization

### Themes
Modify theme variables in `config/style-config.css`:
```css
:root {
  --primary-color: #your-color;
  --background-color: #your-bg;
  --text-color: #your-text;
}
```

### LaTeX Configuration
Adjust math rendering in `config/latex-config.js`:
```javascript
window.katexConfig = {
  delimiters: [...],
  displayMode: true,
  // Add your KaTeX options
};
```

## 📝 Content Management

- **Projects**: Add new projects in respective HTML files or JSON data
- **Notes**: Create new topic files in `pages/notes/topics/`
- **Styles**: Use modular CSS components for consistent styling

## 🔐 Private Sections

Private areas are protected with client-side authentication. Access is maintained through session storage during browsing.

## 🌍 Future Enhancements

- [ ] Additional language support
- [ ] Advanced project filtering
- [ ] Note search functionality
- [ ] Export capabilities for notes
- [ ] Enhanced mobile experience

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This is a personal website template designed for academic and professional portfolio presentation combined with personal knowledge management.
