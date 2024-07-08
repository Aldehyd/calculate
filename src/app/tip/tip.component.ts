import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tip',
  standalone: true,
  imports: [],
  templateUrl: './tip.component.html',
  styleUrl: './tip.component.scss'
})
export class TipComponent {

  @Input() message!: string;

}
