import {Injectable, TemplateRef} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, header: string, options: any = {}) {
    this.toasts.push({ textOrTpl, header, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
