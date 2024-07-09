import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-column-tool-steels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-tool-steels.component.html',
  styleUrl: './column-tool-steels.component.scss'
})
export class ColumnToolSteelsComponent implements OnInit {

  projectName!: string;
  muCu!: number;
  muBc!: number;
  muLu!: number;

  constructor(private columnService:columnService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
  }

  onNextButtonClick():void {
    this.router.navigateByUrl('/column-tool/steel-choice')
  }

}
