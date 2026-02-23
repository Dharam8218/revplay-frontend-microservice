import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { PlayerBarComponent } from '../../../shared/components/player-bar/player-bar';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    PlayerBarComponent  
  ],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {} 