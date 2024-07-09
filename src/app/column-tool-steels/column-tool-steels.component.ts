import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-column-tool-steels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-tool-steels.component.html',
  styleUrl: './column-tool-steels.component.scss'
})
export class ColumnToolSteelsComponent implements OnInit {

  projectName!: string;

  constructor(private columnService:columnService) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
  }

  onNextButtonClick():void {

  }

}
