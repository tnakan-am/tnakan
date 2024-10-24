import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(Storage);

  constructor() {}

  uploadFile(file: any, userId: string): Observable<string> {
    const filePath = `uploads/${userId}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytes(fileRef, file);

    return fromPromise(task.then(() => getDownloadURL(fileRef)));
  }
}
