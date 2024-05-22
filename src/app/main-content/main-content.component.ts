import { Component, OnInit } from '@angular/core';
import { ToolComponent } from '../tool/tool.component';
import { CommonModule } from '@angular/common';
import { Tool } from '../models/tool.model';
import { ToolsListComponent } from '../tools-list/tools-list.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ToolsListComponent,CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit {

  ngOnInit(): void {
    
  }
}
