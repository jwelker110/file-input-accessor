import {AbstractControl} from '@angular/forms';
import {filter, firstValueFrom} from 'rxjs';

export function makeTextFile(name: string, content = '', type = 'text/plain'): File {
    return new File([content], name, {type});
}

export function makePngFile(width: number, height: number): Promise<File> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('2D canvas context unavailable'));
            return;
        }
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 0, width, height);
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('canvas.toBlob returned null'));
                return;
            }
            resolve(new File([blob], `pic-${width}x${height}.png`, {type: 'image/png'}));
        }, 'image/png');
    });
}

// Populates a file input the way a user's selection would and fires `change`.
export function selectFiles(input: HTMLInputElement, files: File[]): void {
    const transfer = new DataTransfer();
    for (const file of files) {
        transfer.items.add(file);
    }
    input.files = transfer.files;
    input.dispatchEvent(new Event('change'));
}

// Resolves with the first status the control reaches after its async validators finish.
export function settled(control: AbstractControl): Promise<string> {
    return firstValueFrom(control.statusChanges.pipe(filter((status) => status !== 'PENDING')));
}
