import { Component, OnInit } from '@angular/core';
import { SingleProjectComponent } from '../single-project/single-project.component';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { accountService } from '../services/account.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [SingleProjectComponent,CommonModule,HttpClientModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects!: any;
  getProjects$!: Observable<any>;
  error!: boolean;

  constructor(
    private http:HttpClient,
    private accountService:accountService
  ) {}

  ngOnInit():void {
      this.getProjects$ = this.http.get(`http://localhost:4000/app/get_projects?mail=${this.accountService.userEmail}`,{responseType: 'json'}).pipe(
        tap(res => {
          if(res === 'non ok') {
            this.error = true;
          } else {
            this.error = false;
            this.projects = res;
          };
        }),
      )
      this.getProjects$.subscribe();
  }
}
