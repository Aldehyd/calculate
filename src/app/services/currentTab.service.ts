import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class currentTabService implements OnInit {
    currentTab!: string;

    ngOnInit(): void {
        this.currentTab = "toolsTab";
    }

    changeCurrentTab(tabTitle: string): void {
        this.currentTab = tabTitle;
    }
}