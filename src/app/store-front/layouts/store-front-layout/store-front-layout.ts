import { Component } from '@angular/core';
import { FrontNavbar } from "../../components/front-navbar/front-navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-store-front-layout',
  imports: [FrontNavbar, RouterOutlet],
  templateUrl: './store-front-layout.html',
  styles: ``
})
export class StoreFrontLayout {

}
