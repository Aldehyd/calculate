import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,AsyncPipe,CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  checkFormValidity$!: Observable<any>;
  checkPassword$!: Observable<any> | undefined;
  hidePassword$!: Observable<any>;
  subscriptionForm!: FormGroup;

  isPasswordVisible!: boolean;
  isConfirmedPasswordVisible!: boolean;
  userPasswordIncludesNumber!: boolean;
  userPasswordIncludesUppercase!: boolean;
  userPasswordIncludesSpecialCharacter!: boolean;
  userPasswordSecurityColor!: string; 
  userPasswordRegEx!: RegExp;
  userEmailRegEx!: RegExp;
  arePasswordsSimilar!: boolean;
  isExistingMail!: boolean;
  isFormInvalid!: boolean;

  confirmationMailSend!: boolean;
  errorOnSubmit!: boolean;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.errorOnSubmit = false;
    this.confirmationMailSend = false;
    this.arePasswordsSimilar = true;
    this.userPasswordIncludesNumber = false;
    this.userPasswordIncludesUppercase = false;
    this.userPasswordIncludesSpecialCharacter = false;
    this.userPasswordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[<>\?\.,;:!§&~"#'\(\)\{\}\-_\|\\\/\^@=\+\*£%°²])[ -~]{8,}$/g;
    this.userEmailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    this.isPasswordVisible = false;
    this.isConfirmedPasswordVisible = false;
    this.isFormInvalid = true;
    this.subscriptionForm = this.formBuilder.group({
      userEmail: [null,[Validators.required,Validators.email]],
      userPassword: [null,[Validators.required,Validators.pattern(this.userPasswordRegEx)]],
      userConfirmedPassword: [null,[Validators.required]]
    });
    this.checkFormValidity$ = this.subscriptionForm.valueChanges.pipe(
      tap(value => {
        if(value.userEmail !== null && value.userPassword !== null && value.userConfirmedPassword !== null)
          this.checkFormValidity()
    })
    );
    this.checkFormValidity$.subscribe();
    this.checkPassword$ = this.subscriptionForm.get('userPassword')?.valueChanges.pipe(
      tap(value => {
        this.checkPasswordNumber(value);
        this.checkPasswordUppercase(value);
        this.checkPasswordSpecialCharacter(value);
      }),
      map(value => this.checkPasswordSecurity(value))
    );
    this.checkPassword$?.subscribe();
  }

  checkPasswordNumber(password: string): void {
    if(password.match(/[0-9]/) !== null) {
      this.userPasswordIncludesNumber = true;
    } else {
      this.userPasswordIncludesNumber = false;
    };  
  }

  checkPasswordUppercase(password: string): void {
    if(password.match(/[A-Z]/) !== null) {
      this.userPasswordIncludesUppercase = true;
    } else {
      this.userPasswordIncludesUppercase = false;
    };  
  }

  checkPasswordSpecialCharacter(password: string): void {
    if(password.match(/[<>?.,;:!§&~"#'(){}\-_|\\\/^@=+*£%°²]/) !== null) {
      this.userPasswordIncludesSpecialCharacter = true;
    } else {
      this.userPasswordIncludesSpecialCharacter = false;
    };  
  }

  handlePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  handleConfirmedPasswordVisibility(): void {
    this.isConfirmedPasswordVisible = !this.isConfirmedPasswordVisible;
  }

  checkPasswordSecurity(password: string): string {
    const numberRegEx = /[0-9]/g;
    const specialCharacterRegEx = /[<>?.,;:!§&~"#'(){}\-_|\\\/^@=+*£%°²]><|=@]/g;
    const upperCaseRegEx = /[A-Z]/g;

    const securityLengthScore = Math.min(password.length,10);

    function correctScore(score: number | undefined) {
      if(score === undefined) {
        return 0;
      } else if(score > 5) {
        return 5;
      };
      return score
    }

    const securityNumberScore = correctScore(password.match(numberRegEx)?.length);
    const securitySpecialCharactersScore = correctScore(password.match(specialCharacterRegEx)?.length);
    const securityUpperCaseScore = correctScore(password.match(upperCaseRegEx)?.length);

    const securityScore = securityLengthScore + securityNumberScore + securitySpecialCharactersScore + securityUpperCaseScore;

    if(securityScore <=10) {
      this.userPasswordSecurityColor = "green";
      return "Faible"
    } else if(securityScore <=15) {
      this.userPasswordSecurityColor = "orange";
      return "Moyenne"
    } else {
      this.userPasswordSecurityColor = "red";
      return "Forte"
    };
  }

  checkFormValidity(): void {
    if(this.subscriptionForm.value.userPassword.match(this.userPasswordRegEx) &&
      this.subscriptionForm.value.userEmail.match(this.userEmailRegEx) &&
      this.subscriptionForm.value.userConfirmedPassword.length > 0) {
      this.isFormInvalid = false;
    } else {
      this.isFormInvalid = true;
    };
  }

  checkPasswordsSimilarity():void {
    if(this.subscriptionForm.value.userPassword === this.subscriptionForm.value.userConfirmedPassword) {
      this.sendConfirmationMail();
    } else {
      this.arePasswordsSimilar = false;
    };
  }

  checkExistingMail():void {
    if(this.subscriptionForm.value.userEmail.includes('M')) { //replace by fetch to server
      this.isExistingMail = true;
    } else {
      this.isExistingMail = false;
    };
    
    if(this.isExistingMail === false) {
      this.checkPasswordsSimilarity();
    };  
  }

  sendConfirmationMail(): void {
    //send mail
    this.errorOnSubmit = true;
    this.confirmationMailSend = false;
    // this.errorOnSubmit = false;
    // this.confirmationMailSend = true;
  }

  submitForm():void {
    if(this.isFormInvalid === false)
      this.checkExistingMail();
  }
}
