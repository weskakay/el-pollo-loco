# 🐔 El Pollo Loco

**A 2D Jump-and-Run Game built with JavaScript & HTML5 Canvas**

El Pollo Loco is a fun and dynamic browser game demonstrating **object-oriented programming (OOP)** concepts in JavaScript.  
Guide your character through a colorful desert world — **run, jump, collect coins, throw bottles,** and defeat enemies to face the mighty **Endboss Chicken!**

---

## 👤 Author

Created by Kay W.

---

## 🎮 Gameplay Preview

![Start Screen](/docs/img/Github_asset_1.png)
![Gameplay](/docs/img/Github_asset_2.png)
![Boss Fight](README_assets/boss-fight.png)

---

## 🎮 Gameplay & Controls

### 🕹️ Desktop
| Action | Key |
|-------|-----|
| Move Right | ➡️ / D |
| Move Left | ⬅️ / A |
| Jump | ⬆️ / W |
| Throw Bottle | F |
| Toggle Music | Button in UI |
| Reset Game | Button in UI |
| Help | Help Button |

### 📱 Mobile Controls
Automatically activated on smartphones / touch devices

💡 *Tip:* Works best in desktop or landscape mobile mode.

---

## 🧠 Features

✅ Object-oriented architecture  
✅ Animated character and enemies  
✅ Collectible coins & bottles  
✅ Health, bottle & coin status bars  
✅ Background music & sound effects (toggleable)  
✅ Responsive layout and canvas scaling  
✅ Parallax scrolling background  
✅ Final Boss fight with alert & attack phases  

---

## 🖥️ Technologies Used

- **HTML5 Canvas API**
- **CSS3**
- **JavaScript (ES6)**
- **Object-Oriented Programming (OOP)**
- **JSDoc** for documentation

---

## 📁 Project Structure

    el-pollo-loco/
    │
    ├── index.html
    ├── style.css
    ├── js/
    │ └── game.js
    │
    ├── models/
    │ ├── background-object.class.js
    │ ├── bottle.class.js
    │ ├── character.class.js
    │ ├── chicken.class.js
    │ ├── small-chicken.class.js <-- NEW
    │ ├── cloud.class.js
    │ ├── drawable-object.class.js
    │ ├── endboss.class.js
    │ ├── keyboard.class.js
    │ ├── level.class.js
    │ ├── moveable-object.class.js
    │ ├── sound-manager.class.js
    │ ├── status-bar.class.js
    │ ├── status-bar-boss.class.js
    │ ├── status-bar-bottle.class.js
    │ ├── status-bar-coin.class.js
    │ ├── throwable-object.class.js
    │ └── world.class.js
    │
    ├── levels/
    │ └── level1.js
    │
    ├── img/
    ├── audio/
    │ ├── small_chicken.mp3
    │
    └── documents/
    └── El Pollo Loco Checkliste.pdf


---

## 📘 Documentation

The complete codebase is documented using **[JSDoc](https://jsdoc.app/)** and the **Docdash** template.

To generate the documentation:

```bash
npm install
npm run docs