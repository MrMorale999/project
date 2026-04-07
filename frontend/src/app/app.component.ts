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
  title = 'Beaver'; // Nome più "tranquillo"
  message = ''; // Inizialmente vuoto per pulizia

  wsStatus = '...';
  wsMessages: string[] = [];
  notificationVisible = false;
  notificationTitle = '';
  notificationBody = '';
  notificationProgress = 100;
  
  private hideTimeout?: any;
  private progressInterval?: any;
  private destroy$ = new Subject<void>();
  private wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/echo`;

  notifyText = '';
  notifyTitle = '';
  notifyResult = '';

  constructor(
    private appService: AppService,
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.appService.getHello()
      .pipe(timeout(5000), catchError(() => of({ text: '' })))
      .subscribe(data => this.message = data.text);

    this.websocketService.getStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.wsStatus = status;
        this.cdr.detectChanges();
      });

    this.websocketService.connect(this.wsUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.wsMessages.push(msg);
        this.cdr.detectChanges();
      });

    this.websocketService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.notificationTitle = notification.title;
        this.notificationBody = notification.body;
        this.notificationVisible = true;
        this.notificationProgress = 100;

        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        if (this.progressInterval) clearInterval(this.progressInterval);

        this.progressInterval = setInterval(() => {
          this.notificationProgress -= 1;
          if (this.notificationProgress <= 0) clearInterval(this.progressInterval);
          this.cdr.detectChanges();
        }, 50); // 5 secondi totali

        this.hideTimeout = setTimeout(() => {
          this.notificationVisible = false;
          this.cdr.detectChanges();
        }, 5000);
      });
  }

  sendWebsocketMessage(): void {
    this.websocketService.send('Ping');
  }

  sendNotify(): void {
    if (!this.notifyTitle) return;

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: this.notifyTitle, body: this.notifyText })
    }).then(() => {
      this.notifyResult = 'Inviato';
      this.notifyTitle = ''; this.notifyText = '';
      setTimeout(() => this.notifyResult = '', 2000);
    });
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