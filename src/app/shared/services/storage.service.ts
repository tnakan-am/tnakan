import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private http = inject(HttpClient);

  uploadFile(file: File, _userId?: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<UploadResponse>(`${environment.apiUrl}/uploads`, formData)
      .pipe(map((res) => res.url));
  }
}
