import { Component, effect, input, signal, output } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styles: ``
})
export class Toast {

  type = input.required<string>();
  message = input.required<string>();
  display = signal<boolean>(false);
  private timer: ReturnType<typeof setTimeout> | null = null;
  clearToast = output();

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  toastChanged = effect(() => {
    if(this.message() && this.type() !== null) {
      this.launchToast();
    }
  });

  launchToast() {
    this.display.set(true);

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.display.set(false);
      this.timer = null;
      this.clearToast.emit();
    }, 5000);
  }

}
