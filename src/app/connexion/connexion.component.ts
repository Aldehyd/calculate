import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent implements OnInit {
  connexionForm!: FormGroup;
  isPasswordVisible!: boolean;
  isFormInvalid!: boolean;
  checkFormValidity$!: Observable<any>;
  isExistingMail!: boolean;
  noExistingMailError!: boolean;

  constructor(
    private accountService: accountService,
    private formBuilder: FormBuilder,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.noExistingMailError = false;
    this.isPasswordVisible = false;
    this.isFormInvalid = true;
    this.connexionForm = this.formBuilder.group({
      userEmail: [null,[Validators.required,Validators.email]],
      userPassword: [null]
    });
    this.checkFormValidity$ = this.connexionForm.valueChanges.pipe(
      tap(value => this.checkFormValidity())
    );
    this.checkFormValidity$.subscribe();
  }

  handlePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  checkFormValidity(): void {
    if(this.connexionForm.value.userEmail !== null &&
      this.connexionForm.value.userPassword !== null &&
      this.connexionForm.value.userEmail.length > 0 &&
      this.connexionForm.value.userPassword.length > 0) {
      this.isFormInvalid = false;
    } else {
      this.isFormInvalid = true;
    };
  }

  checkExistingMail():void {
    if(this.connexionForm.value.userEmail.includes('m')) { //replace by fetch to server
      this.isExistingMail = true;
    } else {
      this.isExistingMail = false;
    };
  }

  onSubmitForm() {
    if(this.isFormInvalid === false)
      this.checkExistingMail();
      if(this.isExistingMail === true) {
        this.accountService.connected = true;
        this.router.navigateByUrl('/')
      } else {
        this.noExistingMailError = true;
      };
  }
}
