import { Component, OnInit, Output } from '@angular/core';
import { SingleProjectComponent } from '../single-project/single-project.component';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { accountService } from '../services/account.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [SingleProjectComponent,CommonModule,LoaderComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects!: any;
  getProjects$!: Observable<any[]>;
  error!: boolean;
  isLoading!: boolean;

  constructor(
    private accountService:accountService
  ) {}

  ngOnInit():void {
      this.isLoading = true;
      this.getProjects$ = this.accountService.getProjects(this.accountService.userEmail).pipe(
        tap(res => {
          if(res === null) {
            this.error = true;
            this.isLoading = false;
          } else {
            this.error = false;
            this.accountService.projects = res;
            this.isLoading = false;
          };
        }),
      );
  }
}
