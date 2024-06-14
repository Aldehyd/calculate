import { Component } from '@angular/core';
import { Form, FormGroup, FormsModule, NgForm, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-section-tool',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './section-tool.component.html',
  styleUrl: './section-tool.component.scss'
})
export class SectionToolComponent {
  projectForm!: FormGroup;

  constructor(
    private router: Router, 
    public sectionToolService: sectionToolService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log(this.sectionToolService.modifyProject)
    this.projectForm = this.formBuilder.group({
      name: [this.sectionToolService.modifyProject === false ? null : this.sectionToolService.projectName,[Validators.required]],
      sectionShape: [this.sectionToolService.modifyProject === false ? null : this.sectionToolService.projectShape,[Validators.required]],
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
