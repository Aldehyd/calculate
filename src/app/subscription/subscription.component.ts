import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  userEmail!: string;
  userPassword!: string;
  userConfirmedPassword!: string;

  ngOnInit(): void {

  }

  onSubmitForm(form: NgForm) {
    console.log(form.value);
  }
}
