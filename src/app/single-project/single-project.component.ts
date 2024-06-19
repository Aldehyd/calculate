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
  @Input() getProjects$!: Observable<any>;

  removeProject$!: Observable<any>;
  modifyProject$!: Observable<any>;

  constructor(private http: HttpClient,
    private sectionToolService: sectionToolService,
    private accountService: accountService,
    private router: Router
  ) {}

  removeProject(id: number): void {
    this.removeProject$ = this.http.post('https://calculs-structure/app/remove_project',{mail: this.accountService.userEmail, id: id},{responseType: 'text'}).pipe(
      tap(()=> {
        this.getProjects$ = this.accountService.getProjects(this.accountService.userEmail);
      })
    );
    this.removeProject$.subscribe();
  }

  modifyProject(id: number): void {
    const projectToModify = this.accountService.projects.find(project => project.id === id);
    switch(projectToModify.tool) {
      case 'Section à parois minces':
        this.sectionToolService.modifyProject = true;
        this.sectionToolService.projectName = projectToModify.name;
        this.sectionToolService.projectShape = projectToModify.projectShape;
        this.sectionToolService.sectionThickness = projectToModify.sectionThickness;
        this.sectionToolService.roundCorner = projectToModify.roundCorner;
        this.sectionToolService.coorMax = projectToModify.coorMax;
        this.sectionToolService.pointsSvgAttribute = projectToModify.pointsSvgAttribute;
        this.sectionToolService.analyzedSection = projectToModify.analyzedSection;
        this.sectionToolService.sollicitationType = projectToModify.sollicitationType;
        this.sectionToolService.elasticLimit = projectToModify.elasticLimit;
        this.router.navigateByUrl('section-tool');
        break;
      default:
        break;
    };
  }
  
}
