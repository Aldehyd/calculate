import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Tool } from '../models/tool.model';
import { ToolComponent } from '../tool/tool.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tools-list',
  standalone: true,
  imports: [CommonModule,ToolComponent],
  templateUrl: './tools-list.component.html',
  styleUrl: './tools-list.component.scss'
})
export class ToolsListComponent implements OnInit{
  tools!: Tool[];

  constructor(
    private route:ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
    if(this.route.snapshot.queryParams['validate-subscription']) {
      this.router.navigate(['/subscription-validated',this.route.snapshot.queryParams['key']]);
    };

    this.tools = [
      {
        id: 0,
        title: "Section à parois minces",
        url: "section-tool",
        description: "Calcul des propriétés d'une section à parois minces avec ou sans raidisseur.",
        norm: "Norme: EN NF 1993 1-3"
      }
    ]
  }
}
