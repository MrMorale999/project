import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

export const appConfig = {
  providers: [
    provideHttpClient()
  ]
};
