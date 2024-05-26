import { Component, OnInit } from '@angular/core';
import { SingleProjectComponent } from '../single-project/single-project.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [SingleProjectComponent,CommonModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects!: any;

  ngOnInit():void {
    this.projects = [
      {
        id: 0,
        name: 'Premier projet',
        tool: 'Section à parois minces',
        date: '14-01-2023'
      },
      {
        id: 1,
        name: 'Second projet',
        tool: 'Section à parois minces',
        date: '25-05-2024'
      }
    ]
  }
}
