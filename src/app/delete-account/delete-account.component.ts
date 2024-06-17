import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap, map } from 'rxjs';
import { accountService } from '../services/account.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {
  isPasswordCorrect!: boolean;
  isAccountRemoved!: boolean;
  checkPassword$!: Observable<Object>;
  removeAccount$!: Observable<Object>;
  removeAccountForm!: FormGroup;
  isFormInvalid!: boolean;
  isProjectsLossWarningChecked!: boolean;
  checkFormValidity$: Observable<Object>;

  constructor(
    private http: HttpClient, 
    private accountService:accountService,
    private formBuilder:FormBuilder) {}

  ngOnInit(): void {
    this.isProjectsLossWarningChecked = false;
    this.isPasswordCorrect = true;
    this.isAccountRemoved = false;
    this.isFormInvalid = true;
    this.removeAccountForm = this.formBuilder.group({
      userPassword: [null],
      projectsLossWarning: [null]
    });
    this.checkFormValidity$ = this.removeAccountForm.valueChanges.pipe(
      tap(value => this.checkFormValidity())
    );
    this.checkFormValidity$.subscribe();
  }

  handleCheckbox(): void {
    this.isProjectsLossWarningChecked = !this.isProjectsLossWarningChecked;
    this.checkFormValidity();
  }

  checkFormValidity(): void {
    if(this.removeAccountForm.value.userPassword.length > 0 &&
      this.isProjectsLossWarningChecked === true) {
      this.isFormInvalid = false;
    } else {
      this.isFormInvalid = true;
    };
  }

  checkPassword(): void {
    this.checkPassword$ = this.http.get(`http://localhost:4000/app/check_password?mail=${this.accountService.userEmail}&password=${this.removeAccountForm.value.userPassword}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'ok') {
          this.removeAccount();
        };
      }),
      map(res => {
        if(res === 'ok') {
          return ''
        } else {
          return 'Le mot de passe est incorrect.'
        };
      })
    );
  }

  removeAccount(): void {
    this.removeAccount$ = this.http.get(`http://localhost:4000/app/remove_account?mail=${this.accountService.userEmail}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res === 'ok') {
          this.isAccountRemoved = true;
        };
      }),
      map(res => {
        if(res === 'ok') {
          return 'Le compte a été supprimé.'
        } else {
          return ''
        }; 
      })
    );
    this.accountService.connected = false;
  }

  onSubmitForm() {
    if(this.isFormInvalid === false)
      this.checkPassword();
  }
}
