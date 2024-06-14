import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { accountService } from '../services/account.service';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';

@Component({
  selector: 'app-single-project',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule],
  templateUrl: './single-project.component.html',
  styleUrl: './single-project.component.scss'
})
export class SingleProjectComponent {

  @Input() project !:any;

  removeProject$!: Observable<any>;
  modifyProject$!: Observable<any>;

  constructor(private http: HttpClient,
    private sectionToolService: sectionToolService,
    private accountService: accountService,
    private router: Router
  ) {}

  removeProject(): void {
    this.removeProject$ = this.http.post('http://localhost:4000/app/remove_project',{mail: this.accountService.userEmail, id: this.project.id}, {responseType: 'text'});
    this.removeProject$.subscribe();
  }

  modifyProject(): void {

    const projectToModify = this.accountService.projects.find(project => project.id === this.project.id);
    this.sectionToolService.modifyProject = true;
    this.sectionToolService.projectName = projectToModify.name;
    this.sectionToolService.projectShape = projectToModify.projectShape;
    this.router.navigateByUrl('section-tool');
  }
  
}
