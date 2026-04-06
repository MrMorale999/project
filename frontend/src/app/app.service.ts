import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BackendMessage {
  text: string;
}

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) {}

  getHello(): Observable<BackendMessage> {
    return this.http.get<BackendMessage>('/api/hello');
  }
}
