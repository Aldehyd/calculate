import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
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

  checkPassword$!: Observable<any>;
  hidePassword$!: Observable<any>;
  subscriptionForm!: FormGroup;

  isPasswordVisible!: boolean;
  userPassword!: string;
  savedUserPassword! : string;
  userConfirmedPassword!: string;
  savedUserConfirmedPassword!: string;
  userPasswordIncludesNumber!: boolean;
  userPasswordIncludesUppercase!: boolean;
  userPasswordIncludesSpecialCharacter!: boolean;
  userPasswordSecurityColor!: string; 
  userPasswordRegEx!: RegExp;

  arePasswordsSimilar!: boolean;
  isExistingMail!: boolean;

  confirmationMailSend!: boolean;
  errorOnSubmit!: boolean;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.errorOnSubmit = false;
    this.confirmationMailSend = false;
    this.arePasswordsSimilar = true;
    this.userPassword= '';
    this.userConfirmedPassword= '';
    this.savedUserPassword = this.userPassword;
    this.userPasswordIncludesNumber = false;
    this.userPasswordIncludesUppercase = false;
    this.userPasswordIncludesSpecialCharacter = false;
    this.userPasswordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[<>\?\.,;:!§&~"#'\(\)\{\}\-_\|\\\/\^@=\+\*£%°²])[ -~]{8,}$/g;
    this.isPasswordVisible = false;
    this.subscriptionForm = this.formBuilder.group({
      userEmail: [null,[Validators.required,Validators.email]],
      userPassword: [null,[Validators.required,Validators.pattern(this.userPasswordRegEx)]],
      userConfirmedPassword: [null,[Validators.required]]
    });
    this.hidePassword$ = this.subscriptionForm.valueChanges.pipe(
      tap(values => this.savedUserPassword = values.userPassword),
      tap(values => {
        if(this.isPasswordVisible === false) {
          this.userPassword = '';
          for(let character of this.userPassword) {
            this.userPassword += '\u25cf';
          };
        };
      })
    );
    this.hidePassword$.subscribe();
    this.checkPassword$ = this.subscriptionForm.valueChanges.pipe(
      tap(values => this.checkPasswordNumber(values.userPassword)),
      tap(values => this.checkPasswordUppercase(values.userPassword)),
      tap(values => this.checkPasswordSpecialCharacter(values.userPassword)),
      map(values => this.checkPasswordSecurity(values.userPassword))
    );
    this.checkPassword$.subscribe();
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
    if(this.isPasswordVisible === true) {
      console.log(this.savedUserPassword)
      this.userPassword = this.savedUserPassword;
    } else {
      this.savedUserPassword = this.userPassword;
      let hiddenPassword = '';
      for(let character of this.userPassword) {
        hiddenPassword += '\u25cf';
      };
      this.userPassword = hiddenPassword;
    };
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

  onSubmitForm() {
    this.checkPasswordsSimilarity();
  }

  checkPasswordsSimilarity():void {
    this.arePasswordsSimilar = this.userPassword === this.userConfirmedPassword;
    if(this.arePasswordsSimilar === true)
      this.checkExistingMail();
  }

  checkExistingMail():void {
    if(this.userPassword.includes('M')) { //replace by fetch to server
      this.isExistingMail = true;
    } else {
      this.isExistingMail = false;
    };
    
    if(this.isExistingMail === false) {
      this.submitForm();
    };  
  }

  submitForm():void {
    // this.subscriptionForm.reset();
    this.confirmationMailSend = false;
    this.errorOnSubmit = true;
    console.log('suscribed !')
  }
}
