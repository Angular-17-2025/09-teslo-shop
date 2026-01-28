import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styles: ``
})
export class Toast {

  type = input.required<string | null>();
  message = input.required<any | null>();
  display = signal<boolean>(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

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
    }, 5000);
  }

}
