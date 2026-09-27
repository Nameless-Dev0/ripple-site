# Ripple (React)

Ripple's front end, rebuilt as a small React app on top of [react-wavify](https://github.com/woofers/react-wavify) for the wave animation.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static build in `dist/`.

## Project layout

```
index.html
src/
  main.jsx
  App.jsx
  styles.css
  assets/sea.png
  components/
    ThemeToggle.jsx
    WaveBackground.jsx
    UploadCard.jsx
    FilterCard.jsx
  utils/
    numberInput.js
    theme.js
```
