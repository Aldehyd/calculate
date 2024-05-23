import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-tool-geometry',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './section-tool-geometry.component.html',
  styleUrl: './section-tool-geometry.component.scss'
})
export class SectionToolGeometryComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    let context = this.canvas.nativeElement.getContext("2d");
    if(context) {
      context.fillStyle = "green";
      context.beginPath();
      context.moveTo(30, 50); 
      context.lineTo(50,100);
      context.lineWidth = 10;
      context.stroke(); 
    };
    
  }
  
}
