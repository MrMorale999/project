import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface BackendNotification {
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket?: WebSocket;
  private messages = new Subject<string>();
  private notifications = new Subject<BackendNotification>();
  private status = new Subject<string>();

  constructor(private zone: NgZone) {}

  connect(url: string): Observable<string> {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.zone.run(() => this.status.next('Connesso'));
    };

    this.socket.onmessage = event => {
      this.zone.run(() => {
        console.log("Messaggio ricevuto dal server: ", event.data);

        let parsed = null;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          parsed = null;
        }

        if (parsed && parsed.type && parsed.type.toString().toLowerCase() === 'notification' && parsed.title != null && parsed.body != null) {
          console.log('Notifica WS rilevata', parsed);
          this.notifications.next({ title: parsed.title.toString(), body: parsed.body.toString() });
        } else {
          if (parsed) {
            console.log('Messaggio WS parsed, non notification', parsed);
          }
          this.messages.next(event.data);
        }
      });
    };

    this.socket.onerror = () => {
      this.zone.run(() => this.status.next('Errore WebSocket'));
      this.messages.error(new Error('WebSocket error'));
    };

    this.socket.onclose = () => {
      this.zone.run(() => this.status.next('Disconnesso'));
      this.messages.complete();
    };

    return this.messages.asObservable();
  }

  send(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  getStatus(): Observable<string> {
    return this.status.asObservable();
  }

  getNotifications(): Observable<BackendNotification> {
    return this.notifications.asObservable();
  }

  close(): void {
    this.socket?.close();
  }
}
