import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class currentTabService implements OnInit {
    currentTab!: number;

    ngOnInit(): void {
        this.currentTab = 0;
    }

    changeCurrentTab(tabId: number): void {
        this.currentTab = tabId;
    }
}