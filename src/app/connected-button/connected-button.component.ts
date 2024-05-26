import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';
@Component({
  selector: 'app-connected-button',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './connected-button.component.html',
  styleUrl: './connected-button.component.scss'
})
export class ConnectedButtonComponent implements OnInit {
  menuDisplayed!: boolean;

  constructor(public accountService: accountService) {}

  ngOnInit(): void {
    this.menuDisplayed = false;
  }

  expandMenu():void {
    this.menuDisplayed = !this.menuDisplayed;
  }

  disconnect(): void {
    this.accountService.connected = false;
  }

}
