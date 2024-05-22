import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent implements OnInit {

  userEmail!: string;
  userPassword!: string;

  ngOnInit(): void {

  }

  onSubmitForm(form: NgForm) {
    console.log(form.value);
  }
}
