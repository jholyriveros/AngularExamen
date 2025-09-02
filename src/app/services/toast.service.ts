import { Injectable } from '@angular/core';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  show(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'info',
    delay: number = 2500
  ): void {
    const toastEl = document.getElementById('appToast');
    if (toastEl) {
      toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-info', 'text-bg-warning');
      toastEl.classList.add(`text-bg-${type}`);
      toastEl.querySelector('.toast-body')!.textContent = message;

      const toast = new bootstrap.Toast(toastEl, { delay });
      toast.show();
    }
  }
}