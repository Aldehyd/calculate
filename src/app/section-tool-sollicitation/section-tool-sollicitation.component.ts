import { Component, OnInit } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-tool-sollicitation',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './section-tool-sollicitation.component.html',
  styleUrl: './section-tool-sollicitation.component.scss'
})
export class SectionToolSollicitationComponent implements OnInit {

  sollicitationForm!: FormGroup;

  constructor(
    public sectionToolService: sectionToolService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit():void {
    this.sollicitationForm = this.formBuilder.group({
      elasticLimit: [null,[Validators.required]],
      sollicitationType: [null]
    });
  }

  onSubmitForm(): void {
    this.sectionToolService.sollicitationType = this.sollicitationForm.value.sollicitationType;
    this.sectionToolService.elasticLimit = this.sollicitationForm.value.elasticLimit;
    this.router.navigateByUrl('/section-tool/area');
  }
}
