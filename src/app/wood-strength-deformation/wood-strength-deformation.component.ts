import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { accountService } from '../services/account.service';
import { woodStrengthDeformationService } from '../services/wood-strength-deformation-service';

@Component({
  selector: 'app-wood-strength-deformation',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './wood-strength-deformation.component.html',
  styleUrl: './wood-strength-deformation.component.scss'
})
export class WoodStrengthDeformationComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(
    private router: Router, 
    public woodStrengthDeformationService: woodStrengthDeformationService,
    public accountService: accountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: [this.woodStrengthDeformationService.projectName,[Validators.required]]
    });
  }

  onSubmitForm() {
    if(this.projectForm.value.name !== null && this.projectForm.value.name.length > 0) {
      this.woodStrengthDeformationService.projectName = this.projectForm.value.name;
      this.router.navigateByUrl('wood-strength-deformation/coeffs');
    };
  }

}
