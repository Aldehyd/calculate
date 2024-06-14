import { Component, OnInit } from '@angular/core';
import { SingleProjectComponent } from '../single-project/single-project.component';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { accountService } from '../services/account.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [SingleProjectComponent,CommonModule,HttpClientModule,LoaderComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects!: any;
  getProjects$!: Observable<any>;
  error!: boolean;
  isLoading!: boolean;

  constructor(
    private http:HttpClient,
    private accountService:accountService
  ) {}

  ngOnInit():void {
      this.isLoading = true;
      this.getProjects$ = this.http.get(`http://localhost:4000/app/get_projects?mail=${this.accountService.userEmail}`,{responseType: 'json'}).pipe(
        tap(res => {
          if(res === 'non ok') {
            this.error = true;
            this.isLoading = false;
          } else {
            this.error = false;
            this.projects = res;
            this.accountService.projects = res;
            this.isLoading = false;
          };
        }),
      )
      this.getProjects$.subscribe();
  }
}
