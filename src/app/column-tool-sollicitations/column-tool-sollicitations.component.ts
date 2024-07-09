import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';

@Component({
  selector: 'app-column-tool-sollicitations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-tool-sollicitations.component.html',
  styleUrl: './column-tool-sollicitations.component.scss'
})
export class ColumnToolSollicitationsComponent implements OnInit {

  projectName!: string;
  momentsSum!: number;
  normalSum!: number;
  e1: number;
  l0!: number;
  A!: number;
  B!: number;
  C!: number;

  constructor(private columnService: columnService) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
    this.momentsSum = 1.35*this.columnService.properties.Mg + 1.5*this.columnService.properties.Mq;
    this.normalSum = 1.35*this.columnService.properties.Ng + 1.5*this.columnService.properties.Nq;
    this.e1 = this.momentsSum/this.normalSum;
    this.l0 = this.columnService.properties.length * Math.sqrt(2)/2;
    this.A = 0.7;
    this.B = 1.1;
    if(this.columnService.properties.isM01M02Unknown === true) {
      this.C = 0.7;
    } else {
      this.C = 1.7 - this.columnService.properties.M01M02;
    };
  }

}
