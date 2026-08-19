# 🌌 The Observer

> A small digital observatory for my new tab.

## About

I built **The Observer** because I wanted my browser's new tab to feel like more than just an empty page.

I wanted to create a small digital observatory where I could see what's happening in space, explore astronomy data, search the web, access my bookmarks, and quickly write down my thoughts.

So I built The Observer as a lightweight, astronomy-inspired new tab dashboard.

My goal was to keep it simple, calm, useful, and visually immersive.

---

## ✨ Features

### 🌠 NASA Picture of the Day

I connected The Observer to NASA's Astronomy Picture of the Day API.

It loads NASA's picture of the day along with its title, date, and explanation.

I also added a button that lets me read the complete explanation in a modal.

### 🛰️ ISS Tracker

I wanted to know where the International Space Station is right now, so I added a live ISS tracker.

It shows:

- Latitude
- Longitude
- Altitude
- Velocity
- Current position

The ISS position is displayed on a simple visual map.

### 👨‍🚀 People in Space

I added a section showing the people currently in orbit.

It displays the number of people in space along with their names and spacecraft.

### 🚀 Next Launch

I added an upcoming launch section using Launch Library 2.

It shows the next upcoming launch and includes a live countdown.

### 🪐 Tonight's Almanac

This is one of my favorite parts of the project.

I created a custom Canvas-based solar-system visualization that displays the planets and some of their physical properties.

I included information such as:

- Planet radius
- Gravity
- Mass
- Number of known moons

The information automatically cycles through the planets.

### ⭐ Animated Starfield

I didn't want the background to be static, so I created an animated starfield using the HTML Canvas API.

The stars subtly twinkle in the background to create an observatory-like atmosphere.

### 🔎 Search

I added a search bar so I can search the web directly from my new tab.

The search currently uses Google.

### 🔗 Bookmarks

I can add my own bookmarks from the Settings panel.

This lets me keep the websites I use frequently directly on my new tab.

### 📝 Field Notes

I wanted somewhere to quickly write down thoughts, ideas, or anything else.

So I added a Field Notes section.

My notes are automatically saved locally in my browser using `localStorage`.

### ⚙️ Settings

I added a settings panel where I can customize:

- My name
- NASA API key
- Bookmarks

My settings are stored locally in the browser.

---

## 🎨 Design

I wanted **The Observer** to feel more like an astronomical observatory than a normal dashboard.

I used a dark indigo-black background with parchment-like text and amber highlights.

I also used:

- Cormorant Garamond
- IBM Plex Mono
- Inter
- Glass-like cards
- Subtle borders
- Canvas animations
- Astronomy-inspired colors

I tried to keep the interface minimal instead of filling it with unnecessary elements.

---

## 🛠️ Built With

I built The Observer using:

- HTML
- CSS
- Vanilla JavaScript
- HTML Canvas API
- Browser Local Storage
- NASA APOD API
- WhereTheISS API
- Launch Library 2
- Google Search

I intentionally kept the project simple.

There is no frontend framework and no complicated build system.

The current version is a self-contained HTML project.

---

## 📁 Project Structure

Right now, the project is intentionally simple:

```text
the-observer/
└── index.html

## Project info

| | |
|---|---|
| Made by | Lakshay |
| Repo | [The Observer](https://github.com/lakshay99b-dotcom/AngveyOS) |

---
