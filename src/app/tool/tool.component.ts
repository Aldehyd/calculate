import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Tool } from '../models/tool.model';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss'
})
export class ToolComponent implements OnInit {

  @Input() tool!: Tool;

  constructor(private router: Router,
    private sectionToolService: sectionToolService
  ) {}

  ngOnInit(): void {
  }

  onDetailsButtonClick(): void {
    this.tool.detailsHidden = !this.tool.detailsHidden;
  }

  openNewProject(): void {
    this.sectionToolService.modifyProject = false;
    this.router.navigateByUrl(this.tool.url);
  }

}
