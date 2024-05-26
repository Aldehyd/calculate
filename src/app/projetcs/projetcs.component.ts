import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';
import { ProjectsListComponent } from '../projects-list/projects-list.component';

@Component({
  selector: 'app-projetcs',
  standalone: true,
  imports: [RouterModule,CommonModule,ProjectsListComponent],
  templateUrl: './projetcs.component.html',
  styleUrl: './projetcs.component.scss'
})
export class ProjetcsComponent {

  constructor(public accountService: accountService) {}

}
