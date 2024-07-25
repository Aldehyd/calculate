import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fluageService } from '../services/fluage.service';
import { accountService } from '../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fluage-tool',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './fluage-tool.component.html',
  styleUrl: './fluage-tool.component.scss'
})
export class FluageToolComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(
    private router: Router, 
    public fluageService: fluageService,
    public accountService: accountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: [this.fluageService.projectName,[Validators.required]]
    });
  }

  onSubmitForm() {
    if(this.projectForm.value.name !== null && this.projectForm.value.name.length > 0) {
      this.fluageService.projectName = this.projectForm.value.name;
      this.router.navigateByUrl('fluage-tool/properties');
    };
  }

}
