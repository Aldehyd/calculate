import { Component, OnInit } from '@angular/core';
import { Tab } from '../models/tab.model';
import { MainTabComponent } from '../main-tab/main-tab.component';

@Component({
  selector: 'app-main-tabs',
  standalone: true,
  imports: [MainTabComponent],
  templateUrl: './main-tabs.component.html',
  styleUrl: './main-tabs.component.scss'
})
export class MainTabsComponent implements OnInit{
  toolsTab!: Tab;
  projectsTab!: Tab;

  ngOnInit(): void {
    this.toolsTab = new Tab(0,"Outils");
    this.projectsTab = new Tab(0,"Projects");
  }
}
