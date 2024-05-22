import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Tool } from '../models/tool.model';
import { ToolComponent } from '../tool/tool.component';

@Component({
  selector: 'app-tools-list',
  standalone: true,
  imports: [CommonModule,ToolComponent],
  templateUrl: './tools-list.component.html',
  styleUrl: './tools-list.component.scss'
})
export class ToolsListComponent implements OnInit{
  tools!: Tool[];

  ngOnInit(): void {
    this.tools = [
      {
        id: 0,
        title: "Section à parois minces",
        description: "Calcul des propriétés d'une section à parois minces avec ou sans raidisseur.",
        norm: "Norme: EN NF 1993 1-3"
      },
      {
        id: 1,
        title: "Vent",
        description: "Calcul du vent.",
        norm: "Norme: EN NF 1991 1-1"
      }
    ]
  }
}
