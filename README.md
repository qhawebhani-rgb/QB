# QB for School - AI Study Assistant PWA

A modern Progressive Web App (PWA) designed to help students study effectively with built-in quiz, note-taking, and Pomodoro timer features.

## Features

### 📚 Quiz System
- Create custom quizzes on any topic
- Choose the number of questions (3, 5, or 10)
- Get instant feedback and scoring
- Track your quiz performance

### 📝 Note Taking
- Create and save study notes
- Organize notes with titles and timestamps
- View all your saved notes in one place
- Quick delete functionality

### ⏱️ Pomodoro Timer
- Customizable work and break durations
- Track study sessions
- Monitor total study time
- Session counter for the day

### 📊 Dashboard
- View daily statistics
- Track quizzes taken, notes created, and minutes studied
- See recent activity
- Quick access to all features

### 🌓 Dark/Light Mode
- Toggle between dark and light themes
- Preference saved locally

### 📱 PWA Features
- Offline-first capability with service worker
- Install as standalone app on mobile and desktop
- Responsive design for all screen sizes
- Fast loading and smooth performance

## Getting Started

### Installation

#### Option 1: Direct Access
Simply open the app in your browser at `/QB/`

#### Option 2: Install as App (PWA)
1. Visit the app URL in your browser
2. Click the install/add to home screen button (varies by browser)
3. The app will be installed locally

### Browser Support
- Chrome/Edge 45+
- Firefox 44+
- Safari 11.1+
- Mobile browsers with PWA support

## Usage

### Quiz
1. Navigate to the Quiz tab
2. Enter a topic (e.g., Biology, Math, History)
3. Select number of questions
4. Answer each question and track your progress
5. Get your final score

### Notes
1. Go to the Notes tab
2. Enter a title and content
3. Click "Save Note"
4. View all saved notes below
5. Delete notes when no longer needed

### Timer
1. Open the Timer tab
2. Customize work and break durations (optional)
3. Click "Start" to begin
4. Click "Pause" to pause (resume available after pause)
5. Click "Reset" to reset
6. Get alerts when sessions complete

## Technical Stack

- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling with CSS variables and Grid/Flexbox
- **Vanilla JavaScript** - No dependencies required
- **Service Worker** - Offline support and caching
- **LocalStorage** - Data persistence

## File Structure

```
QB/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── app.js             # Application logic
├── sw.js              # Service worker
├── manifest.json      # PWA manifest
└── README.md          # This file
```

## Features Details

### Local Storage
- All data is stored locally in your browser
- Nothing is sent to any server
- Use "Clear All Data" in settings to reset

### Offline Support
- Works completely offline after first visit
- Service worker caches essential files
- All features available without internet

### Responsive Design
- Mobile-first approach
- Works on phones, tablets, and desktops
- Touch-friendly interface

## Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary: #6366F1;      /* Main color */
  --secondary: #EC4899;    /* Accent color */
  --background: #0F172A;   /* Background */
}
```

### Add More Questions
Edit the `generateQuestions()` function in `app.js` to add more topics and questions.

## Performance

- Initial load: ~50KB
- Service worker caching: ~30KB
- Minimal JavaScript: ~25KB
- All assets optimized

## Troubleshooting

### Service Worker not working
- Clear browser cache
- Ensure HTTPS (or localhost)
- Check browser console for errors

### Data not persisting
- Check if LocalStorage is enabled
- Ensure browser allows storage for this domain
- Try clearing browser cache and reloading

### App not installing
- Use HTTPS or localhost
- Ensure manifest.json is accessible
- Check browser supports PWA

## Privacy

QB respects your privacy:
- No user tracking
- No data collection
- No external API calls
- All data stored locally

## Browser Compatibility

| Browser | Support |
|---------|----------|
| Chrome  | ✅ Full |
| Edge    | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Opera   | ✅ Full |

## License

MIT License - feel free to use and modify

## Contributing

Feel free to submit issues and enhancement requests!

## Version

Current Version: 1.0.0

---

**QB for School** - Making studying smarter, not harder! 📚✨