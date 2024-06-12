import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ToolComponent } from './tool/tool.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { accountService } from './services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,ToolComponent,MainMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'calculate';

  constructor(private accountService: accountService) {}

  ngOnInit(): void {
    this.accountService.connected = false;
  }
}
