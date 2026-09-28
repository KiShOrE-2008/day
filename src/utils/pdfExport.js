import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getPhotoUrl } from '../lib/wishesService';

/**
 * Converts an image URL into a base64 Data URL to prevent CORS taint during canvas render.
 */
async function urlToBase64(url) {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Could not convert image to base64:', err);
    return null;
  }
}

/**
 * Generates a high-resolution downloadable PDF keepsake memory book containing all wishes and photos.
 * @param {Array} wishes Array of wish objects
 * @param {Function} onProgress Progress status callback (optional)
 */
export async function generateWishesPDF(wishes = [], onProgress = () => {}) {
  if (!wishes || wishes.length === 0) {
    throw new Error('No wishes available to generate PDF.');
  }

  onProgress('Preparing memory book images...');

  // Pre-load all photo base64 strings
  const wishesWithPhotos = await Promise.all(
    wishes.map(async (wish) => {
      let photoData = null;
      if (wish.photo_path) {
        const publicUrl = getPhotoUrl(wish.photo_path);
        photoData = await urlToBase64(publicUrl);
      }
      return { ...wish, base64Photo: photoData };
    })
  );

  onProgress('Formatting memory book layout...');

  // Create temporary container for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96 DPI
  container.style.backgroundColor = '#0d0d11';
  container.style.color = '#F5F1EA';
  container.style.fontFamily = 'serif, Georgia, system-ui';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Build HTML string
  let html = `
    <div style="padding: 40px 50px; background: linear-gradient(135deg, #140910 0%, #0d0d11 100%);">
      <!-- COVER PAGE -->
      <div style="min-height: 1050px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border: 2px solid rgba(183, 110, 121, 0.4); padding: 50px 30px; border-radius: 24px; position: relative; background: radial-gradient(circle at center, rgba(183,110,121,0.12) 0%, transparent 70%);">
        
        <div style="font-size: 32px; color: #E89CA7; margin-bottom: 12px;">✦ ♥ ✦</div>
        
        <h1 style="font-size: 42px; font-weight: bold; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 16px 0; font-family: serif;">
          Sowmiyaa's Birthday Wish Keepsake
        </h1>
        
        <p style="font-size: 18px; color: #E89CA7; font-style: italic; margin: 0 0 40px 0; max-width: 500px; line-height: 1.6;">
          A timeless collection of birthday wishes, messages, and memories from loved ones to keep lifelong.
        </p>
        
        <div style="display: inline-block; padding: 10px 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(232,156,167,0.3); border-radius: 50px; font-size: 14px; color: rgba(245,241,234,0.8);">
          <span>${wishes.length} ${wishes.length === 1 ? 'Wish' : 'Wishes'} Collected</span> • <span>${today}</span>
        </div>

        <div style="position: absolute; bottom: 40px; font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase;">
          Forever Memory Book ❤️
        </div>
      </div>

      <!-- WISHES SECTION -->
      <div style="margin-top: 50px;">
  `;

  wishesWithPhotos.forEach((w, idx) => {
    const formattedDate = w.created_at
      ? new Date(w.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

    html += `
      <div style="page-break-inside: avoid; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(183, 110, 121, 0.25); border-radius: 20px; padding: 30px; margin-bottom: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: sans-serif;">
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          
          ${
            w.base64Photo
              ? `<div style="flex-shrink: 0;">
                  <img src="${w.base64Photo}" style="width: 100px; h-100px; height: 100px; object-fit: cover; border-radius: 16px; border: 2px solid #B76E79; box-shadow: 0 4px 15px rgba(183,110,121,0.3);" />
                </div>`
              : ''
          }
          
          <div style="flex-grow: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div>
                <span style="font-size: 20px; font-weight: 700; color: #FFFFFF; font-family: serif;">${w.name}</span>
                ${
                  w.relationship
                    ? `<span style="margin-left: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; background: rgba(183,110,121,0.25); border: 1px solid rgba(183,110,121,0.5); color: #E89CA7; border-radius: 20px;">${w.relationship}</span>`
                    : ''
                }
              </div>
              <span style="font-size: 12px; color: rgba(245,241,234,0.5); font-family: monospace;">${formattedDate}</span>
            </div>

            <div style="position: relative; margin-top: 14px; padding-left: 16px; border-left: 3px solid #B76E79;">
              <p style="font-size: 14px; line-height: 1.7; color: rgba(245,241,234,0.9); margin: 0; white-space: pre-wrap; font-style: italic; font-family: Georgia, serif;">
                "${w.message}"
              </p>
            </div>
          </div>

        </div>
      </div>
    `;
  });

  html += `
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 60px; text-align: center; padding: 30px; border-top: 1px dashed rgba(183,110,121,0.3); color: rgba(245,241,234,0.6); font-size: 13px;">
        Made with love for Sowmiyaa's Birthday Celebration • Keepsake Document ❤️
      </div>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);

  onProgress('Rendering PDF pages...');

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0d0d11',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    onProgress('Downloading PDF...');
    pdf.save(`Sowmiyaa_Birthday_Wishes_Keepsake.pdf`);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
