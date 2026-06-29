import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const APP_URL = 'https://moybei.github.io/vitrox-company-trip-2026/';

export default function Share() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard?.writeText(APP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="sh-page">
      <div className="sh-card">
        <div className="sh-hdr">
          <span className="sh-emoji">📱</span>
          <span className="sh-title">Share this app</span>
        </div>
        <p className="sh-sub">Scan the QR code or copy the link to install on your phone.</p>

        <div className="sh-qr-wrap">
          <QRCodeSVG
            value={APP_URL}
            size={220}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
            marginSize={2}
          />
        </div>

        <div className="sh-link-row">
          <span className="sh-link">{APP_URL.replace('https://', '')}</span>
          <button className="sh-copy-btn" onClick={copyLink}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className="sh-tip">
          <strong>iOS:</strong> Safari → Share → Add to Home Screen
        </div>
        <div className="sh-tip">
          <strong>Android:</strong> Chrome → ⋮ → Install app
        </div>
      </div>
    </div>
  );
}
