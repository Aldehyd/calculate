import { Component } from '@angular/core';
import { Form, FormGroup, FormsModule, NgForm, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
@Component({
  selector: 'app-section-tool',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './section-tool.component.html',
  styleUrl: './section-tool.component.scss'
})
export class SectionToolComponent {
  projectForm!: FormGroup;

  constructor(
    private router: Router, 
    private sectionToolService: sectionToolService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: [null,[Validators.required]],
      sectionShape: [null,[Validators.required]],
    });
  }

  onSubmitForm() {
    if(this.projectForm.value.name !== null && this.projectForm.value.name.length > 0 && this.projectForm.value.sectionShape) {
      this.sectionToolService.projectName = this.projectForm.value.name;
      this.sectionToolService.projectShape= this.projectForm.value.sectionShape;
      this.router.navigateByUrl("section-tool/geometry");
    };
  }
}
