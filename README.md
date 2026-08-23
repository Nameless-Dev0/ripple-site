# Ripple (React)

Ripple's front end, rebuilt as a small React app on top of [react-wavify](https://github.com/woofers/react-wavify) for the wave animation.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static build in `dist/`.

## What changed vs. the original vanilla version

- **Wave animation** — the hand-rolled `<canvas>` wave in `script.ts` is gone. The background is now three stacked `<Wave>` layers from `react-wavify` (`src/components/WaveBackground.jsx`), all using the theme's `--accent` color at different opacities/speeds for a bit of depth, with no sand layer.
- **"Swash" on Apply Filter** — clicking **Apply Filter** re-triggers the same impact-then-settle envelope the old canvas splash used (a quick eased rise, then a bouncy decay back to rest), applied to the front wave layer's height/amplitude. There are no particle effects; it's done entirely through the wave shape itself.
- **Removed copy** — the "32-bit Float Range (10 max decimals)" helper text is gone from both the cutoff and bandwidth fields.
- **Fixed the large-number bug (scientific notation)** — the cutoff/bandwidth fields are no longer native `<input type="number">` elements. A native number input silently switches to scientific notation once you type enough digits, and the old code's 10-character trim (meant for decimals) would then chop off the exponent, turning a huge number into a tiny decimal. The fields are now plain, fully-controlled text inputs (`src/utils/numberInput.js`) that cap the digit count at 10 on every keystroke — once you hit the limit, further digits just don't get added, so there's nothing left for a browser to reformat.
- **Fixed the large-number bug (silent rounding)** — on blur, the old code also ran the value through `Math.fround` to "clamp it to a 32-bit float," which is what turned `2342342342` into `2342342400`: float32 only has ~7 significant decimal digits, so larger integers get silently rounded to the nearest representable value. That rounding is gone; the commit step (`commitNumericValue`) now only fills in a fallback for an empty/invalid value and trims cosmetic loose ends (a bare `-`, a trailing `.`, leading zeros) — every digit you type is preserved.
- **React components** — theme toggle, upload dropzone, and filter settings are now `ThemeToggle`, `UploadCard`, and `FilterCard` components under `src/components/`, using React state instead of manual DOM queries.

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
