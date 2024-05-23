import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-section-tool',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './section-tool.component.html',
  styleUrl: './section-tool.component.scss'
})
export class SectionToolComponent {
  projectName!: string;

  ngOnInit(): void {

  }

  onSubmitForm(form: NgForm) {
    console.log(form.value);
  }
}
