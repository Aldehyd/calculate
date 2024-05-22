import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Tab } from '../models/tab.model';

@Component({
  selector: 'app-main-tab',
  standalone: true,
  imports: [],
  templateUrl: './main-tab.component.html',
  styleUrl: './main-tab.component.scss'
})
export class MainTabComponent {
  @Input() tab!: Tab;
}
