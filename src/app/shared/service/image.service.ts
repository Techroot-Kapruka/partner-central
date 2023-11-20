import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }
  async validateImage(event, imgID) {
    var validation:any;
    if (event.target.files.length === 0) {
      return false;
    }
    var x = (document.getElementById(imgID) as HTMLImageElement);
    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'Error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return false; // Stop further actions if the image is not a JPEG
    }

    // Check the image resolution
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    // Create a promise to hold the async operation
    const checkImageResolution = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
          Swal.fire(
            'Error',
            'The maximum resolution supported for images is 5000x5000 pixels.',
            'error'
          );
          (document.getElementById(imgID) as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
          reject('Invalid image resolution'); // Reject the promise to stop further actions
        } else {
          resolve();
        }
      };
    });

    try {
      await checkImageResolution;
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        (document.getElementById(imgID ) as HTMLInputElement).src = reader.result.toString();
      };

      // Upload and handle the image
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        await this.resizeImage(file).then((resizedFile) => {
          validation=resizedFile;
          })
          .catch((error) => {
            (document.getElementById(imgID) as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
            Swal.fire(
              'error',
              'Image upload error: ' + error,
              'error'
            );
            return false;
          });
      }else{
        return false;
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'The maximum resolution supported for images is 5000x5000 pixels.',
        'error'
      );
      return false;
    }
    return validation;
  }

  async resizeImage(file: File): Promise<File> {
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
