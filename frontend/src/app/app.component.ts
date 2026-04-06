import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of, timeout, takeUntil, Subject } from 'rxjs';
import { AppService } from './app.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend Angular';
  message = 'Caricamento in corso...';

  wsStatus = 'Non connesso';
  wsMessages: string[] = [];
  notificationVisible = false;
  notificationTitle = '';
  notificationBody = '';
  notificationProgress = 100;
  private hideTimeout?: any;
  private progressInterval?: any;

  private destroy$ = new Subject<void>();
  private wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/echo`;

  constructor(
    private appService: AppService,
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appService.getHello()
      .pipe(
        timeout(8000),
        catchError(() => of({ text: 'Impossibile raggiungere il backend.' }))
      )
      .subscribe({
        next: data => this.message = data.text,
        error: () => this.message = 'Impossibile raggiungere il backend.'
      });

    this.websocketService.getStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => this.wsStatus = status);

    this.websocketService.connect(this.wsUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: msg => {
          console.log('Echo messaggio WebSocket', msg);
          this.wsMessages.push(msg);
        },
        error: () => this.wsMessages.push('Errore di comunicazione WebSocket'),
      });

    this.websocketService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        console.log('Notifica ricevuta in componente', notification);
        this.notificationTitle = notification.title;
        this.notificationBody = notification.body;
        this.notificationVisible = true;
        console.log('notificationVisible impostato a', this.notificationVisible);
        this.cdr.detectChanges();

        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
        }
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }

        this.notificationProgress = 100;

        this.progressInterval = setInterval(() => {
          this.notificationProgress -= 2;
          if (this.notificationProgress <= 0) {
            clearInterval(this.progressInterval);
            this.notificationProgress = 0;
          }
          this.cdr.detectChanges();
        }, 100);

        this.hideTimeout = setTimeout(() => {
          this.notificationVisible = false;
          this.cdr.detectChanges();
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
          }
        }, 5000);
      });

  }

  sendWebsocketMessage(): void {
    this.websocketService.send('Ciao dal client!');
  }

  notifyText = '';
  notifyTitle = '';
  notifyResult = '';

  sendNotify(): void {
    const body = {
      title: this.notifyTitle || 'Notifica dal frontend',
      body: this.notifyText || 'Corpo della notifica inviato dal client.'
    };

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(async response => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Errore ${response.status}: ${text}`);
        }
        const text = await response.text();
        this.notifyResult = 'Notifica inviata: ' + text;
      })
      .catch(error => {
        console.error('Fallita chiamata notify:', error);
        this.notifyResult = 'Invio notifica fallito: ' + error.message;
      });
  }

  showTestModal(): void {
    this.notificationTitle = 'TEST MODALE ATTIVO';
    this.notificationBody = 'Questo serve per verificare rendering e stile.';
    this.notificationVisible = true;
    this.cdr.detectChanges();
  }

  closeNotification(): void {
    this.notificationVisible = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.close();
  }
}
