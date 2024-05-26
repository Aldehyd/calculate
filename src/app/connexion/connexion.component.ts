import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent implements OnInit {

  userEmail!: string;
  userPassword!: string;

  constructor(private accountService: accountService) {}

  ngOnInit(): void {

  }

  onSubmitForm(form: NgForm) {
    console.log(form.value);
    this.accountService.connected = true;
    console.log(this.accountService)
  }
}
