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
  isPasswordCorrect!: boolean;
  isPasswordVisible!: boolean;
  isAccountInactive!: boolean;
  isFormInvalid!: boolean;
  checkFormValidity$!: Observable<any>;
  isExistingMail!: boolean;
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
    this.isPasswordCorrect = true;
    this.noExistingMailError = false;
    this.isPasswordVisible = false;
    this.isFormInvalid = true;
    this.isAccountInactive = false;
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
    this.checkExistingMail$ = this.http.get(`http://localhost:4000/app/check_existing_mail?mail=${this.connexionForm.value.userEmail}`,{responseType: 'text'}).pipe(
      tap(res => {
        console.log(res)
        if(res === 'yes') {
          this.isExistingMail = true;
        } else {
          this.isExistingMail = false;
        }; 
      })
    );
    this.checkExistingMail$.subscribe();
    
    if(this.isExistingMail === true) {
      this.checkAccountActive();
    } else {
      this.noExistingMailError = true;
    };
  }

  checkAccountActive(): void {
    this.checkAccountActive$ = this.http.get(`http://localhost:4000/app/check_account_active?mail=${this.connexionForm.value.userEmail}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'ok') {
          this.isAccountInactive = false;
          this.checkPassword();
        } else {
          this.isAccountInactive = true;
        }; 
      })
    );
    this.checkAccountActive$.subscribe();
  }

  checkPassword(): void {
    this.checkPassword$ = this.http.get(`http://localhost:4000/app/check_password?mail=${this.connexionForm.value.userEmail}&password=${this.connexionForm.value.userPassword}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'ok') {
          console.log('connect')
          this.isPasswordCorrect = true;
          this.accountService.connected = true;
          this.accountService.userEmail = this.connexionForm.value.userEmail;
          this.router.navigateByUrl('/');
        } else {
          this.isPasswordCorrect = false;
        }; 
      })
    );
    this.checkPassword$.subscribe();
  }

  onSubmitForm() {
    if(this.isFormInvalid === false)
      this.checkExistingMail();
  }
}
