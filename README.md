# 🗣️ Voice Journal – A Daily Voice-Based Journal App

Voice Journal is a self-contained, offline-capable web application that allows users to **record daily voice entries**, **transcribe them to text**, and **organize entries by date**. Designed with a calming and modern UI, it enables seamless journaling through speech—perfect for quick thoughts, reflections, or voice memos.

---

## ☰ Table of Contents

- [✨ Features](#-features)
- [🛠️ Technologies Used](#🛠️-technologies-used)
- [🎞️ Key Packages](#🎞️-key-packages)
- [🧑‍💻 Project Structure](#🧑‍💻-project-structure)
- [🚀 Getting Started](#🚀-getting-started)
- [📝 License](#📝-license)
- [🤝 Contributing](#🤝-contributing)
- [📌 Notes](#📌-notes)

---

## ✨ Features

- 🎧 **Voice Recording**: Use your microphone to record journal entries with a start/stop toggle.
- ✍️ **Speech-to-Text Transcription**: Automatically transcribes spoken words using the Web Speech API.
- 📅 **Date-Grouped Entries**: View entries grouped by the day they were added.
- ⭐ **Star Favorite Entries**: Mark important recordings for quick access on the Profile page.
- 🗑️ **Delete Entries**: Swipe to delete (on mobile) or click delete buttons (on desktop).
- 📀 **LocalStorage Support**: Entries are saved locally in the browser — no server required.
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
- ⚙️ **Offline-First**: Works even without an internet connection (ideal for daily journaling).

---

## 🛠️ Technologies Used

### Frontend

- **Next.js** – UI and state management, and, Routing and performance optimization
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Smooth animations and transitions
- **Web Speech API** – Voice recognition and transcription
- **LocalStorage API** – Persistent local data storage

---

## 🎞️ Key Packages

| Package         | Purpose                             |
| --------------- | ----------------------------------- |
| `next`          | React framework for SSR and routing |
| `react`         | UI library                          |
| `tailwindcss`   | CSS styling                         |
| `framer-motion` | Animations                          |
| `classnames`    | Conditional className handling      |
| `uuid`          | Generate unique entry IDs           |

---

## 🧑‍💻 Project Structure

```
/pages
  ├── index.tsx          # Home (entry list)
  ├── add-entry.tsx      # Add Entry (voice recorder)
  └── profile.tsx        # Profile (favorites, user info)

/components
  ├── EntryCard.tsx
  ├── Recorder.tsx
  └── Header.tsx

/hooks
  └── useSpeechRecognition.ts

/utils
  └── storage.ts         # Handles localStorage read/write
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/voice-journal.git
cd voice-journal
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Run the App Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests and feedback are welcome! If you'd like to help with bug fixes, design improvements, or new features, feel free to open an issue or submit a PR.
Also feel free to star⭐, fork, or even contribute.

---

## 📌 Notes

- The app uses the **Web Speech API**, which may have **limited support** on some browsers (best on Chrome).
- All data is stored **locally in the browser** — clearing cache or switching devices will remove entries.

---
