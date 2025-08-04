# ChiCanDoIt 🚀

An AI-powered daily agenda tracker that keeps you accountable and helps you conquer your goals. Built with Next.js, React, and modern web technologies for a blazing-fast, responsive experience.

![ChiCanDoIt](./preview.png)

## ✨ Features

### Core Functionality
- **AI-Powered Task Management** - Smart prioritization and insights powered by OpenAI
- **Real-time Accountability** - Get hourly check-ins and progress updates
- **Smart Notifications** - Never miss what matters with intelligent reminders
- **Beautiful UI/UX** - Modern, responsive design with dark mode support
- **Keyboard Shortcuts** - Power-user friendly with comprehensive shortcuts
- **Drag & Drop** - Intuitive task reordering with smooth animations
- **Performance Optimized** - Sub-200KB bundle size for lightning-fast loading

### Recent Enhancements (v2.0)
- **🎨 Dark Mode** - System-aware theme with manual override
- **⌨️ Keyboard Navigation** - Complete keyboard control for power users
- **🔄 Drag-and-Drop** - Visual task reordering with haptic feedback
- **📱 Mobile Responsive** - Perfect experience on all devices
- **⚡ Performance Monitor** - Real-time Core Web Vitals tracking
- **🔍 SEO Optimized** - Enterprise-level SEO implementation
- **♿ Accessibility** - WCAG 2.1 AA compliant

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustup.rs/) (latest stable)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chi-can-do-it.git
   cd chi-can-do-it
   ```

2. **Run the setup script**
   
   **Windows:**
   ```bash
   setup.bat
   ```
   
   **macOS/Linux:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start development**
   ```bash
   npm run tauri dev
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run tauri dev` - Start Tauri development mode
- `npm run tauri build` - Build native application
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Structure

```
chi-can-do-it/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript definitions
│   └── styles/            # CSS and styling
├── src-tauri/             # Rust backend
│   ├── src/               # Rust source code
│   ├── icons/             # Application icons
│   └── Cargo.toml         # Rust dependencies
├── public/                # Static assets
└── dist/                  # Built application
```

### Architecture Philosophy

Following your preference for domain modeling, the application is structured around core domains:

- **Task Domain** - Central entity representing work to be done
- **Goal Domain** - Higher-level objectives that tasks contribute to
- **Category Domain** - Organizational structure for grouping related work
- **Progress Domain** - Tracking completion and momentum

Each domain has clear boundaries and well-defined interfaces, making the codebase maintainable and extensible.

## 🎯 Key Concepts

### Working Backwards from Goals

The app encourages you to start with your end goals and work backwards:

1. **Define your objectives** - What do you want to achieve?
2. **Break into tasks** - What specific work needs to be done?
3. **Prioritize ruthlessly** - What matters most right now?
4. **Execute with focus** - One task at a time, with full attention

### Task Priority System

Tasks are organized using a simple but effective priority system:

- **🔴 High** - Urgent and important (do first)
- **🟡 Medium** - Important but not urgent (schedule)
- **🟢 Low** - Neither urgent nor important (eliminate or delegate)

## 🔧 Configuration

The application stores data locally using Tauri's filesystem APIs. Configuration and data files are stored in:

- **Windows:** `%APPDATA%/chi-can-do-it/`
- **macOS:** `~/Library/Application Support/chi-can-do-it/`
- **Linux:** `~/.local/share/chi-can-do-it/`

## 📦 Building for Production

### Development Build
```bash
npm run tauri build
```

### Release Build
```bash
npm run tauri build -- --release
```

The built application will be in `src-tauri/target/release/bundle/`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) for native desktop performance
- UI powered by [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Chi Can Do It** - Because you absolutely can! 💪