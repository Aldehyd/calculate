import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';
import { ProjectsListComponent } from '../projects-list/projects-list.component';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-projetcs',
  standalone: true,
  imports: [RouterModule,CommonModule,ProjectsListComponent,HttpClientModule,LoaderComponent],
  templateUrl: './projetcs.component.html',
  styleUrl: './projetcs.component.scss'
})
export class ProjetcsComponent implements OnInit {

  constructor(
    public accountService: accountService) {}

  ngOnInit(): void {
    
  }
}
