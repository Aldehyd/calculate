import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Tool } from '../models/tool.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss'
})
export class ToolComponent implements OnInit {

  @Input() tool!: Tool;

  ngOnInit(): void {
  }

  onDetailsButtonClick(): void {
    this.tool.detailsHidden = !this.tool.detailsHidden;
  }

}
