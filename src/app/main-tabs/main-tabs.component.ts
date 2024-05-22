import { Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { Tab } from '../models/tab.model';
import { currentTabService } from '../services/currentTab.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-tabs.component.html',
  styleUrl: './main-tabs.component.scss'
})
export class MainTabsComponent implements OnInit{

  constructor(private currentTabService: currentTabService){
  }

  ngOnInit(): void {
    // this.tabs = [
    //   {
    //     id: 0,
    //     title: "outils",
    //   },
    //   {
    //     id: 1,
    //     title: "mes projets",
    //   }
    // ]

  }
}
