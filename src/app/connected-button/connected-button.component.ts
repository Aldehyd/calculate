import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-connected-button',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './connected-button.component.html',
  styleUrl: './connected-button.component.scss'
})
export class ConnectedButtonComponent implements OnInit {
  menuDisplayed!: boolean;

  ngOnInit(): void {
    this.menuDisplayed = false;
  }

  onClick():void {
    this.menuDisplayed = !this.menuDisplayed;
  }

}
