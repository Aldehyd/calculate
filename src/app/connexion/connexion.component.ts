import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent implements OnInit {
  connexionForm!: FormGroup;
  userEmail!: string;
  userPassword!: string;

  constructor(
    private accountService: accountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.connexionForm = this.formBuilder.group({
      userMail: [null,[Validators.required,Validators.email]],
      userPassword: [null]
    })
  }

  onSubmitForm() {
    // console.log(form.value);
    this.accountService.connected = true;
    console.log(this.accountService)
  }
}
