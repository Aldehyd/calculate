import { Component, OnInit } from '@angular/core';
import { Tab } from '../models/tab.model';
import { MainTabComponent } from '../main-tab/main-tab.component';
import { currentTabService } from '../services/currentTab.service';

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
  currentTab!: string;

  constructor(private currentTabService: currentTabService){}

  ngOnInit(): void {
    this.toolsTab = new Tab(0,"Outils");
    this.projectsTab = new Tab(0,"Mes projets");
    this.currentTab = this.currentTabService.currentTab;
  }

}
