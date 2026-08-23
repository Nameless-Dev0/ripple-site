import { useRef, useState } from 'react';

const MAX_BYTES = 500 * 1024 * 1024;

function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? (mb / 1024).toFixed(2) + ' GB' : mb.toFixed(1) + ' MB';
}

export default function UploadCard() {
  const [fileLabel, setFileLabel] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;

    const isWav =
      file.type === 'audio/wav' || file.type === 'audio/x-wav' || /\.wav$/i.test(file.name);

    if (!isWav) {
      setError("This doesn't look like a WAV file. Choose a file ending in .wav.");
      setFileLabel('');
      return;
    }

    if (file.size > MAX_BYTES) {
      setError(`This file is ${formatSize(file.size)}. The limit is 500MB — choose a smaller file.`);
      setFileLabel('');
      return;
    }

    setError('');
    setFileLabel(file.name + ' — ' + formatSize(file.size));
  }

  function openPicker() {
    fileInputRef.current?.click();
  }

  return (
    <div className="card">
      <h2>Upload WAV File</h2>
      <p className="card-sub">Select a WAV file to strip its metadata and apply filters.</p>

      <div
        className={`dropzone${dragOver ? ' dragover' : ''}${error ? ' error' : ''}`}
        id="dropzone"
        tabIndex={0}
        role="button"
        aria-label="Choose a WAV file to upload"
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer ? e.dataTransfer.files[0] : null;
          if (file) handleFile(file);
        }}
      >
        <div className="icon-badge">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4"></path>
            <path d="M6 10l6-6 6 6"></path>
            <path d="M4 20h16"></path>
          </svg>
        </div>
        <p className="choose-label">Choose a File</p>
        <p className="file-hint">WAV files up to 500MB</p>
        <p className="file-name">{fileLabel}</p>
      </div>

      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        accept=".wav,audio/wav"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
      />
      <button className="choose-btn" id="chooseBtn" type="button" onClick={openPicker}>
        Choose a WAV File
      </button>

      <div className={`error-message${error ? ' visible' : ''}`} role="alert">
        {error}
      </div>
    </div>
  );
}
