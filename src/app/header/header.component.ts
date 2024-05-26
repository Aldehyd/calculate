import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConnectedButtonComponent } from '../connected-button/connected-button.component';
import { CommonModule } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { accountService } from '../services/account.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,ConnectedButtonComponent,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  urlLogo!: string;

  constructor(public accountService: accountService) {}

  ngOnInit(): void {
    this.urlLogo = "../../assets/img/logo.png";
  }

}
