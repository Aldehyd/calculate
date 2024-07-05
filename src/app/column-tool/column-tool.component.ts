import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { accountService } from '../services/account.service';
import { columnService } from '../services/column.service';

@Component({
  selector: 'app-column-tool',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './column-tool.component.html',
  styleUrl: './column-tool.component.scss'
})
export class ColumnToolComponent implements OnInit {

  projectForm!: FormGroup;

  constructor(
    private router: Router, 
    public columnService: columnService,
    public accountService: accountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: [this.columnService.projectName,[Validators.required]]
    });
  }

  onSubmitForm() {
    if(this.projectForm.value.name !== null && this.projectForm.value.name.length > 0) {
      this.columnService.projectName = this.projectForm.value.name;
      this.router.navigateByUrl('column-tool/properties');
    };
  }

}
