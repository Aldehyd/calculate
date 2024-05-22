import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-tab',
  standalone: true,
  imports: [],
  templateUrl: './main-tab.component.html',
  styleUrl: './main-tab.component.scss'
})
export class MainTabComponent {
  @Input() title!: string;
  
}
