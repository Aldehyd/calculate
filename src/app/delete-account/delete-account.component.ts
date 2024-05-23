import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {
  userPassword!: string;

  ngOnInit(): void {

  }

  onSubmitForm(form: NgForm) {
    console.log(form.value);
  }
}
