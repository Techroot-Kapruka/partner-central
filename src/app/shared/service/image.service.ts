import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  resizeImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 700;
      canvas.height = 700;

      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        // Calculate the new image dimensions, maintaining aspect ratio
        let width, height;
        if (image.width > image.height) {
          width = canvas.width;
          height = image.height * (canvas.width / image.width);
        } else {
          height = canvas.height;
          width = image.width * (canvas.height / image.height);
        }

        // Calculate position to center the image
        const offsetX = (canvas.width - width) / 2;
        const offsetY = (canvas.height - height) / 2;


        // Create a white background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the centered and resized image onto the canvas
        try {
          ctx.drawImage(image, offsetX, offsetY, width, height);
        } catch (e) {
          reject('Image Drawing Error');
          return;
        }

        // Convert the canvas content to a File
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: file.type });
            resolve(resizedFile);
          } else {
            reject('Canvas toBlob Error');
          }
        }, file.type);
      };

      image.onerror = () => {
        reject('Image Loading Error');
      };
    });
  }
}
