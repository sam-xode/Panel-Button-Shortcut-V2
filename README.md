# Panel Button Shortcut V2

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A powerful, customizable floating panel with shortcut buttons that can be added to any website. This Tampermonkey script provides an elegant solution for quick access to your favorite websites and tools.

## 🌟 Features

### Customizable Buttons
- **Add, Edit & Delete Buttons**: Easily manage your shortcuts
- **Drag & Drop Sorting**: Rearrange buttons in your preferred order
- **Custom Icons**: Choose from a variety of emoji icons for your buttons
- **Context Menu**: Right-click on buttons to edit or delete

### Visual Enhancements
- **Multiple Themes**: Choose from Dark, Light, Blue, and Neon themes
- **Spring Animations**: Smooth, natural-feeling animations
- **Adaptive Design**: Panel adjusts based on the website's light/dark mode
- **Backdrop Blur**: Modern glass-like effect for a sleek appearance

### User Experience
- **Keyboard Shortcut**: Toggle panel with Alt+P
- **Auto-Hide**: Panel and buttons hide automatically when not in use
- **Persistent Settings**: Your configuration is saved across browsing sessions
- **Counter Function**: Built-in counter with animated feedback

## 📥 Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create a new script in Tampermonkey
3. Copy and paste the entire script code
4. Save the script (Ctrl+S)

## 🔧 Usage

### Basic Controls
- **Show Panel**: Click the "🛠️ Panel" button on the bottom left of any webpage or press Alt+P
- **Add Button**: Enter button name and URL in the input fields at the top of the panel
- **Edit Button**: Right-click on any button and select "✏️ Edit"
- **Delete Button**: Right-click on any button and select "🗑️ Delete"
- **Reorder Buttons**: Drag buttons using the handle (⋮⋮) on the right side

### Themes
Select your preferred visual theme by clicking on the theme color circles at the top of the panel.

### Counter
The panel includes a simple counter function:
- **Increment**: Click the "➕ Count" button
- **Reset**: Click the "🔄 Reset" button

## 🖼️ Screenshots

![SamXode Panel Dark Theme](/screenshots/dark-theme.png)
*Dark Theme (Default)*

![SamXode Panel Light Theme](/screenshots/light-theme.png)
*Light Theme*

![SamXode Panel Button Edit](/screenshots/edit-button.png)
*Button Edit Dialog*

## ⚙️ Customization

### Default Buttons
The script comes with these default buttons:
- Calculator
- Discord
- Gmail
- Telegram
- Notion

You can modify the default buttons by editing this section of the code:
```javascript
let customButtons = JSON.parse(localStorage.getItem('samxoinCustomButtons')) || [
    { label: 'Calculator', icon: '🧮', action: 'openCalculator' },
    { label: 'Discord', icon: '💬', url: 'https://discord.com/channels/@me' },
    { label: 'Gmail', icon: '📧', url: 'https://mail.google.com' },
    { label: 'Telegram', icon: '📱', url: 'tg://', action: 'openTelegram' },
    { label: 'Notion', icon: '📝', action: 'openNotion' }
];
```

### Adding Custom Themes
You can add custom themes by modifying the `themes` object in the script.


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Join Our Telegram Group!
Join our Telegram group for more bot scripts and discussions:
➡️ [Join Telegram Group](https://t.me/sam_xode)

## 💌 Contact
For questions or contributions, reach out via:
- **GitHub**: [sam-xode](https://github.com/sam-xode)
- **Twitter**: [@Sam_xode](https://twitter.com/Sam_xode)
- **Telegram**: [sam_xode](https://t.me/sam_xode)

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://twitter.com/Sam_xode">SamXode</a></sub> 
</p>
