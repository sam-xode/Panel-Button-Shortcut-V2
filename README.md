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

![SamXode Panel Dark Theme](https://arrow-wing-897.notion.site/image/attachment%3A7a880cd0-df46-47f0-92c1-e5a018d143c4%3Aimage.png?table=block&id=1a5c089c-b470-803a-a8a9-ceeb2ebec7ea&spaceId=12427a77-ab6b-4a2b-92db-1330e9dfdf1b&width=1270&userId=&cache=v2)
*Dark Theme (Default)*

![SamXode Panel Light Theme](https://arrow-wing-897.notion.site/image/attachment%3A858b868f-3209-4fc3-8246-ebee3422eb4a%3Aimage.png?table=block&id=1a5c089c-b470-806d-bf7f-e72865689388&spaceId=12427a77-ab6b-4a2b-92db-1330e9dfdf1b&width=1300&userId=&cache=v2)
*Light Theme*

![SamXode Panel Button Edit](https://arrow-wing-897.notion.site/image/attachment%3A4816c6d4-3dec-4db0-838a-7b65ceeff3b6%3Aimage.png?table=block&id=1a5c089c-b470-804a-97df-e1d1791de76a&spaceId=12427a77-ab6b-4a2b-92db-1330e9dfdf1b&width=780&userId=&cache=v2)
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
