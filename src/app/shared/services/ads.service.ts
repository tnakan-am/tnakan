import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdPayload, Advertisement } from '../interfaces/advertisement.interface';

@Injectable({ providedIn: 'root' })
export class AdsService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/ads`;

  getApproved(): Observable<Advertisement[]> {
    return this.http.get<Advertisement[]>(this.base);
  }

  getMine(): Observable<Advertisement[]> {
    return this.http.get<Advertisement[]>(`${this.base}/mine`);
  }

  getAll(approved?: boolean): Observable<Advertisement[]> {
    const params =
      approved === undefined ? undefined : new HttpParams().set('approved', String(approved));
    return this.http.get<Advertisement[]>(`${this.base}/admin`, { params });
  }

  create(ad: AdPayload): Observable<Advertisement> {
    return this.http.post<Advertisement>(this.base, ad);
  }

  update(id: string, ad: Partial<AdPayload>): Observable<Advertisement> {
    return this.http.patch<Advertisement>(`${this.base}/${id}`, ad);
  }

  approve(id: string, approved: boolean): Observable<Advertisement> {
    return this.http.patch<Advertisement>(`${this.base}/${id}/approve`, { approved });
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.base}/${id}`);
  }
}
