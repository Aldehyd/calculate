import { CommonModule } from '@angular/common';
import { Component, Output, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent implements OnInit {
  @Output() activeSectionType = new EventEmitter<string>();

  localActiveSectionType!: string;

  ngOnInit(): void {
    this.localActiveSectionType = 'brut';
    this.activeSectionType.emit(this.localActiveSectionType);
  }

  onBrutClick() {
    if(this.localActiveSectionType === 'net') {
      this.localActiveSectionType = 'brut';
      this.activeSectionType.emit(this.localActiveSectionType);
    };
  }

  onNetClick() {
    if(this.localActiveSectionType === 'brut') {
      this.localActiveSectionType = 'net';
      this.activeSectionType.emit(this.localActiveSectionType);
    };
  }

}
