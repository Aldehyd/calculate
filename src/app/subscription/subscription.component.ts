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
  visiblePassword$!: Observable<any>;
  subscriptionForm!: FormGroup;

  isPasswordVisible!: boolean;
  userPassword!: string;
  savedUserPassword! : string;
  userPasswordIncludesNumber!: boolean;
  userPasswordIncludesUppercase!: boolean;
  userPasswordIncludesSpecialCharacter!: boolean;
  userPasswordSecurityColor!: string; 
  userPasswordRegEx!: RegExp;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userPassword= '';
    this.savedUserPassword = this.userPassword;
    this.userPasswordIncludesNumber = false;
    this.userPasswordIncludesUppercase = false;
    this.userPasswordIncludesSpecialCharacter = false;
    this.userPasswordRegEx = /[A-Z]{1}[0-9]{1}[<>?.,;:!§&~"#'(){}\-_|\\\/^@=+*£%°²]{1}/g;
    this.isPasswordVisible = false;
    this.subscriptionForm = this.formBuilder.group({
      userEmail: [null,[Validators.required]],
      userPassword: [null,[Validators.required,Validators.pattern(this.userPasswordRegEx)]],
      userConfirmedPassword: [null,[Validators.required]]
    });
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
    if(this.isPasswordVisible) {
      this.userPassword = this.savedUserPassword;
    } else {
      this.savedUserPassword = this.userPassword;
      let hiddenPassword = '';
      for(let character of this.userPassword) {
        hiddenPassword += '*';
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

  onSubmitForm(form: NgForm) {
    console.log(form.value);
  }

}
