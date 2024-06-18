import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule,HttpClientModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent implements OnInit {
  connexionForm!: FormGroup;
  isPasswordVisible!: boolean;
  isFormInvalid!: boolean;
  checkFormValidity$!: Observable<any>;
  noExistingMailError!: boolean;
  checkExistingMail$!: Observable<any>;
  checkPassword$!: Observable<Object>;
  checkAccountActive$!:Observable<Object>;

  constructor(
    private accountService: accountService,
    private formBuilder: FormBuilder,
    private router:Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
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
    this.checkExistingMail$ = this.http.get(`https://calculs-structure.fr/app/check_existing_mail?mail=${this.connexionForm.value.userEmail}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'yes') {
          this.checkAccountActive();
        };
      })
    );
  }

  checkAccountActive(): void {
    this.checkAccountActive$ = this.http.get(`https://calculs-structures.fr/app/check_account_active?mail=${this.connexionForm.value.userEmail}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'ok') {
          this.checkPassword();
        };
      })
    );
  }

  checkPassword(): void {
    this.checkPassword$ = this.http.get(`https://calculs-structure.fr/app/check_password?mail=${this.connexionForm.value.userEmail}&password=${this.connexionForm.value.userPassword}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'ok') {
          this.accountService.connected = true;
          this.accountService.userEmail = this.connexionForm.value.userEmail;
          this.router.navigateByUrl('/');
        };
      })
    );
  }

  onSubmitForm() {
    if(this.isFormInvalid === false)
      this.checkExistingMail();
  }
}
