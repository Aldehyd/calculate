import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
@Component({
  selector: 'app-section-tool',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './section-tool.component.html',
  styleUrl: './section-tool.component.scss'
})
export class SectionToolComponent {
  projectName!: string;

  constructor(private router: Router, private sectionToolService: sectionToolService) {}

  ngOnInit(): void {

  }

  onSubmitForm(form: NgForm) {
    this.sectionToolService.projectName = this.projectName;
    this.router.navigateByUrl("section-tool/geometry");
  }
}
