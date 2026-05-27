import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment';
import { SignatureLabel } from './Signature.styles';
import { colors } from '@m-next/styles';

interface SignatureData {
  name?: string;
  documentId: string;
}

type DrawingType = string | undefined;

interface ScreenCaptureReturn {
  generate: (
    signature: SignatureData,
    drawing: DrawingType,
    element: HTMLElement,
    isIOS: boolean
  ) => Promise<[Blob, Blob]>;
}

const ScreenCapture = (): ScreenCaptureReturn => {
  const generateSignatureCanvas = (signature: SignatureData): HTMLCanvasElement => {
    const isDrawn = !signature.name;

    // Calculate width
    let width = 245;
    const height = isDrawn ? 125 : 70;

    let signatureImage: HTMLImageElement | null = null;
    if (isDrawn) {
      signatureImage = document.getElementById('signature-drawing-img') as HTMLImageElement;
      if (signatureImage) {
        width = signatureImage.offsetWidth > 245 ? signatureImage.offsetWidth : 245;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Background color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text color
    ctx.fillStyle = colors.grey ?? '';

    // Space to be added if signature is drawn
    let extraSpace = 0;

    if (!isDrawn) {
      // Add signatory name
      ctx.font = "24px 'Kalam'";
      ctx.fillText(signature.name ?? '', 0, 25);
    } else if (signatureImage) {
      // Add signature drawing
      extraSpace = 50;
      ctx.drawImage(
        signatureImage,
        0,
        0,
        signatureImage.offsetWidth / (signatureImage.offsetHeight / 80),
        80
      );
    }

    const defaultFont = "14px 'Source Sans Pro', Helvetica, Arial, sans-serif";

    ctx.font = defaultFont;
    ctx.fillText(
      `${!isDrawn ? signature.name : 'Signed'} ${moment().format('MMMM DD, YYYY')}`,
      0,
      45 + extraSpace
    );

    ctx.font = `bold ${defaultFont}`;
    ctx.fillText('ID:', 0, 65 + extraSpace);

    ctx.font = defaultFont;
    ctx.fillText(signature.documentId.split('-').join(''), 20, 65 + extraSpace);

    return canvas;
  };

  const getSignaturePrintReady = (signature: SignatureData, drawing: DrawingType): string => {
    const signatureMarkup = (
      <div>
        <div id='signature-image-title' style={{ padding: '10px 0', fontWeight: 'bold' }}>
          Signature
        </div>
        {signature.name ? (
          <SignatureLabel>{signature.name}</SignatureLabel>
        ) : (
          <img src={drawing} style={{ height: '80px' }} alt='drawing' />
        )}
        <p>
          {signature.name ? signature.name : 'Signed'} {moment().format('MMMM DD, YYYY')}
        </p>
        <p>
          <b>ID:</b> {signature.documentId.split('-').join('')}
        </p>
      </div>
    );

    // This is required as the clone element is not a react > JSX object
    return ReactDOMServer.renderToStaticMarkup(signatureMarkup);
  };

  const generate = async (
    signature: SignatureData,
    drawing: DrawingType,
    element: HTMLElement,
    isIOS: boolean
  ): Promise<[Blob, Blob]> => {
    const yScrolll = window.scrollY;
    if (isIOS) window.scroll(0, 0);

    // Clone the element before changing its properties
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Add a bunch of styling to move the element out of screen viewport.
    clonedElement.style.position = 'absolute';
    clonedElement.style.zIndex = '-100';
    clonedElement.style.left = '-4000px';
    // We want one standard document size, regardless of the screen size
    clonedElement.style.width = '1000px';

    // Add it to DOM for html2Canvas library to capture it
    // This is temporary and will be removed from the DOM once the screen capture is complete.
    document.body.appendChild(clonedElement);

    const signaturebody = getSignaturePrintReady(signature, drawing);

    const signatureButtons = clonedElement.querySelector('#signature-buttons') as HTMLElement;
    if (signatureButtons) {
      signatureButtons.style.display = 'none';
      signatureButtons.className = '';
    }
    const wrapper = clonedElement.querySelector('#signature-widget-wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.style.margin = '0px';
      wrapper.style.border = '0px';
      wrapper.style.padding = '0px';
      wrapper.innerHTML = signaturebody;
    }

    // Calculate the metadata for the canvas
    const htmlWidth = clonedElement.offsetWidth;

    const topLeftMargin = 20;
    const imageHeight = htmlWidth * 1.41;
    const pdfWidth = htmlWidth + topLeftMargin * 2;
    const pdfHeight = imageHeight + topLeftMargin * 2;
    const scale = 2;

    // *** Capture screen
    const options = { allowTaint: true, useCORS: true, scale };
    // if (!base.browser.isIE) {
    //   options.scrollX = 0;
    //   options.scrollY = -window.scrollY;
    // }

    const canvas = await html2canvas(clonedElement, options);
    canvas.getContext('2d', { willReadFrequently: true });

    const screenImage = canvas.toDataURL('image/jpeg', 1.0);

    // If you want this to print on A4 just pass 'a4' instead of [pdfWidth, pdfHeight]
    const pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);

    const isWhiteCell = (data: Uint8ClampedArray, index: number) => {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      return red === 255 && green === 255 && blue === 255 && alpha === 255;
    };

    const isWhiteRow = (data: Uint8ClampedArray, y: number, canvasWidth: number) => {
      for (let x = 0; x < canvasWidth; x++) {
        const index = (y * canvasWidth + x) * 4;
        if (!isWhiteCell(data, index)) {
          return false;
        }
      }
      return true;
    };

    const getCuts = (pageCanvas: HTMLCanvasElement, maxPageHeight: number) => {
      const cuts = [0];
      let lastWhiteRow = 0;
      let currentPageEnd = Math.min(maxPageHeight, pageCanvas.height);
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      const { data } = ctx.getImageData(0, 0, pageCanvas.width, pageCanvas.height);

      for (let y = 300; y < pageCanvas.height; y++) {
        if (isWhiteRow(data, y, pageCanvas.width)) {
          lastWhiteRow = y;
        }
        if (y === currentPageEnd) {
          if (lastWhiteRow !== cuts[cuts.length - 1]) {
            cuts.push(lastWhiteRow);
            currentPageEnd = Math.min(lastWhiteRow + maxPageHeight, pageCanvas.height);
          } else {
            cuts.push(currentPageEnd);
            lastWhiteRow = currentPageEnd;
            currentPageEnd = Math.min(currentPageEnd + maxPageHeight, pageCanvas.height);
          }
        }
      }
      return cuts;
    };

    if (canvas.height > pdfHeight * scale) {
      const cuts = getCuts(canvas, imageHeight * scale);
      // Calculate number of segments needed
      const numSegments = cuts.length;

      for (let i = 0; i < cuts.length; i++) {
        // Create a new canvas to hold the segment
        const cutY = cuts[i] || 0;
        const nextCutY = cuts[i + 1] || canvas.height;

        const segmentCanvas = document.createElement('canvas');
        segmentCanvas.width = canvas.width;
        segmentCanvas.height = nextCutY - cutY;
        const context = segmentCanvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        // Draw the image segment onto the canvas
        context.drawImage(canvas, 0, -cutY);

        // Convert segment to data URL
        const segmentDataUrl = segmentCanvas.toDataURL('image/jpeg', 1.0);

        // Add the image segment to the PDF
        pdf.addImage(
          segmentDataUrl,
          'JPEG',
          topLeftMargin,
          topLeftMargin,
          canvas.width / scale,
          segmentCanvas.height / scale,
        );

        // Add new page if not the last segment
        if (i < numSegments - 1) {
          pdf.addPage([pdfWidth, pdfHeight]);
        }
      }
    } else {
      // Image fits within one page, add it directly
      pdf.addImage(screenImage, 'JPEG', topLeftMargin, topLeftMargin, canvas.width / scale, canvas.height / scale);
    }

    // Remove it from the DOM
    document.body.removeChild(clonedElement);
    if (isIOS) {
      window.scroll(0, yScrolll);
    }

    // IE Support
    const signatureCanvas = generateSignatureCanvas(signature);
    const signatureImage: Blob = await new Promise((resolve) =>
      signatureCanvas.toBlob((blob) => resolve(blob as Blob), 'image/jpeg', 1.0)
    );

    const docPdf: Blob = pdf.output('blob');

    // Return binary
    const files: [Blob, Blob] = [docPdf, signatureImage];
    return files;
  };

  return {
    generate
  };
};

export default ScreenCapture;
