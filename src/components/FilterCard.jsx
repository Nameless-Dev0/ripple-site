import { useState } from 'react';
import { sanitizeNumericInput, commitNumericValue } from '../utils/numberInput.js';

export default function FilterCard({ onApply }) {
  const [order, setOrder] = useState('4');
  const [type, setType] = useState('lowpass');
  const [cutoff, setCutoff] = useState('1000');
  const [bandwidth, setBandwidth] = useState('200');

  const bandwidthDisabled = !(type === 'bandpass' || type === 'bandstop');

  function applyFilter() {
    const settings = {
      order: parseInt(order, 10) || 1,
      type,
      cutoffHz: parseFloat(cutoff) || 0,
      bandwidthHz: parseFloat(bandwidth) || 0,
    };
    // eslint-disable-next-line no-console
    console.log('[Ripple C API Stub] Executing filter with parameters:', settings);
    onApply();
  }

  return (
    <div className="card">
      <h2>Filter Settings</h2>
      <p className="card-sub">Configure the filter to apply to your file.</p>

      <div className="field">
        <label htmlFor="order">Filter order</label>
        <div className="slider-row">
          <input
            type="range"
            id="order"
            min="1"
            max="64"
            step="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
          <span className="slider-value">{order}</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="type">Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="lowpass">Low pass</option>
          <option value="highpass">High pass</option>
          <option value="bandpass">Bandpass</option>
          <option value="bandstop">Bandstop</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="cutoff">Cutoff frequency (Hz)</label>
        <input
          type="text"
          inputMode="decimal"
          id="cutoff"
          value={cutoff}
          onChange={(e) => setCutoff(sanitizeNumericInput(e.target.value))}
          onBlur={() => setCutoff((v) => commitNumericValue(v, 1000))}
        />
      </div>

      <div className="field">
        <label htmlFor="bandwidth">Bandwidth (Hz)</label>
        <input
          type="text"
          inputMode="decimal"
          id="bandwidth"
          value={bandwidth}
          disabled={bandwidthDisabled}
          onChange={(e) => setBandwidth(sanitizeNumericInput(e.target.value))}
          onBlur={() => setBandwidth((v) => commitNumericValue(v, 200))}
        />
        <p className="field-help">Only used for bandpass and bandstop filters</p>
      </div>

      <button className="apply-btn" id="applyFilterBtn" type="button" onClick={applyFilter}>
        Apply Filter
      </button>
    </div>
  );
}
