import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle.jsx';
import WaveBackground from './components/WaveBackground.jsx';
import UploadCard from './components/UploadCard.jsx';
import FilterCard from './components/FilterCard.jsx';
import { getInitialTheme, persistTheme } from './utils/theme.js';
import logo from './assets/sea.png';

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [splashSeed, setSplashSeed] = useState(0);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    persistTheme(next);
  }

  return (
    <>
      <WaveBackground splashSeed={splashSeed} />

      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="wrap">
        <header>
          <div className="brand">
            <img src={logo} alt="" className="logo" width="40" height="40" />
            <h1 className="title">Ripple</h1>
          </div>
          <p className="tagline">A minimal audio DSP library for WAV files</p>
        </header>

        <div className="panels">
          <UploadCard />
          <FilterCard onApply={() => setSplashSeed((s) => s + 1)} />
        </div>

        <footer></footer>
      </div>
    </>
  );
}
