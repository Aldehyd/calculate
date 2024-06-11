import { Component, OnInit } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-section-tool-sollicitation',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './section-tool-sollicitation.component.html',
  styleUrl: './section-tool-sollicitation.component.scss'
})
export class SectionToolSollicitationComponent implements OnInit {

  sollicitationForm!: FormGroup;
  isFormInvalid!: boolean;
  checkFormValidity$!: Observable<Object>;

  constructor(
    public sectionToolService: sectionToolService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit():void {
    this.isFormInvalid = true;
    this.sollicitationForm = this.formBuilder.group({
      elasticLimit: [null,[Validators.required]],
      sollicitationType: [null]
    });
    this.checkFormValidity$ = this.sollicitationForm.valueChanges.pipe(
      tap(value => {
        if(value.elasticLimit !== null && value.sollicitationType !== null )
          this.isFormInvalid = false;
      })
    );
    this.checkFormValidity$.subscribe();
  }

  onSubmitForm(): void {
    if(this.isFormInvalid === false) {
      this.sectionToolService.sollicitationType = this.sollicitationForm.value.sollicitationType;
      this.sectionToolService.elasticLimit = this.sollicitationForm.value.elasticLimit;
      this.router.navigateByUrl('/section-tool/area');
    };
  }
}
