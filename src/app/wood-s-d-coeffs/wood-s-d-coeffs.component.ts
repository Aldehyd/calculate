import { Component, OnInit } from '@angular/core';
import { woodStrengthDeformationService } from '../services/wood-strength-deformation-service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';
import { accountService } from '../services/account.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-wood-s-d-coeffs',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule,RouterModule],
  templateUrl: './wood-s-d-coeffs.component.html',
  styleUrl: './wood-s-d-coeffs.component.scss'
})
export class WoodSDCoeffsComponent implements OnInit {
  projectName!: string;
  kmod!: number;
  kdef!: number;
  action!: string[];
  kmodDetermine!: any;
  kdefDetermine!: any;
  woodForm!: FormGroup;
  updateForm$!: Observable<any>;

  availableClassesService!: any;
  projectSaved!: boolean;
  errorOnProjectSave!: boolean;

  saveProject$: Observable<any>;

  constructor(
    private woodStrengthDeformationService: woodStrengthDeformationService,
    private formBuilder: FormBuilder,
    public accountService: accountService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.projectName = this.woodStrengthDeformationService.projectName;
    this.availableClassesService = {1: false, 2: false, 3: false};
    this.woodForm = this.formBuilder.group({
      materiau: null,
      type: null,
      classeService: null,
      action: null
    });
    this.kmodDetermine = {
      massif: {
        1: [0.6,0.7,0.8,0.9,1.1],
        2: [0.6,0.7,0.8,0.9,1.1],
        3: [0.5,0.55,0.65,0.7,0.9]
      },
      lamelleColle: {
        1: [0.6,0.7,0.8,0.9,1.1],
        2: [0.6,0.7,0.8,0.9,1.1],
        3: [0.5,0.55,0.65,0.7,0.9]
      },
      lvl: {
        1: [0.6,0.7,0.8,0.9,1.1],
        2: [0.6,0.7,0.8,0.9,1.1],
        3: [0.5,0.55,0.65,0.7,0.9]
      },
      contreplaque: {
        1: {
          1: [0.6,0.7,0.8,0.9,1.1]
        },
        2: {
          2: [0.6,0.7,0.8,0.9,1.1]
        },
        3: {
          3: [0.5,0.55,0.65,0.7,0.9]
        }
      },
      osb: {
        2: {
          1: [0.3,0.45,0.65,0.85,1.1]
        },
        3: {
          1: [0.4,0.5,0.7,0.9,1.1],
          2: [0.3,0.4,0.55,0.7,0.9]
        },
        4: {
          1: [0.4,0.5,0.7,0.9,1.1],
          2: [0.3,0.4,0.55,0.7,0.9]
        }
      },
      particules: {
        4: {
          1: [0.3,0.45,0.65,0.85,1.1]
        },
        5: {
          1: [0.3,0.45,0.65,0.85,1.1],
          2: [0.2,0.3,0.45,0.6,0.8]
        },
        6: {
          1: [0.4,0.5,0.7,0.9,1.1]
        },
        7: {
          1: [0.4,0.5,0.7,0.9,1.1],
          2: [0.3,0.4,0.55,0.7,0.9]
        }
      },
      fibresDur: {
        LA: {
          1: [0.3,0.45,0.65,0.85,1.1]
        },
        HLA1: {
          1: [0.3,0.45,0.65,0.85,1.1],
          2: [0.2,0.3,0.45,0.6,0.8]
        },
        HLA2: {
          1: [0.3,0.45,0.65,0.85,1.1],
          2: [0.2,0.3,0.45,0.6,0.8]
        }
      },
      fibresSemiDur: {
        LA1: {
          1: [0.2,0.4,0.6,0.8,1.1]
        },
        LA2: {
          1: [0.2,0.4,0.6,0.8,1.1]
        },
        HLS1: {
          1: [0.2,0.4,0.6,0.8,1.1],
          2: ['none','none','none',0.45,0.8]
        },
        HSL2: {
          1: [0.2,0.4,0.6,0.8,1.1],
          2: ['none','none','none',0.45,0.8]
        }
      },
      mdf: {
        LA: {
          1: [0.2,0.4,0.6,0.8,1.1]
        },
        HLS: {
          1: [0.2,0.4,0.6,0.8,1.1],
          2: ['none','none','none',0.45,0.8]
        }
      }
    };
    this.kdefDetermine = {
      massif: {
        1: 0.6,
        2: 0.8,
        3: 2
      },
      lamelleColle: {
        1: 0.6,
        2: 0.8,
        3: 2
      },
      lvl: {
        1: 0.6,
        2: 0.8,
        3: 2
      },
      contreplaque: {
        1: {
          1: 0.8,
        },
        2: {
          1: 0.8,
          2: 1
        },
        3: {
          1: 0.8,
          2: 1,
          3: 2.5
        }
      },
      osb: {
        2: {
          1: 2.25
        },
        3: {
          1: 1.5,
          2: 2.25
        },
        4: {
          1: 1.5,
          2: 2.25
        }
      },
      particules: {
        4: {
          1: 2.25
        },
        5: {
          1: 2.25,
          2: 3
        },
        6: {
          1: 1.5
        },
        7: {
          1: 1.5,
          2: 2.25
        }
      },
      fibresDur: {
        LA: {
          1: 2.25
        },
        HLA1: {
          1: 2.25,
          2: 3
        },
        HLA2: {
          1: 2.25,
          2: 3
        }
      },
      fibresSemiDur: {
        LA: {
          1: 3
        },
        LA2: {
          1: 3
        },
        HLS1: {
          1: 3,
          2: 4
        },
        HSL2: {
          1: 3,
          2: 4
        }
      },
      mdf: {
        LA: {
          1: 2.25
        },
        HLS: {
          1: 2.25,
          2: 3
        }
      }
    };
    this.projectSaved = false;
    this.errorOnProjectSave = false;
  }

  ngAfterViewInit(): void {
    this.updateForm$ = this.woodForm.valueChanges.pipe(
      tap(formValues => {
        this.updateAvailableClassesService();
        if(formValues.classeService !== null) {
          this.determineKdef();
          this.determineKmod();
        };
      })
    );
    // this.updateForm$.subscribe();
  }

  updateAvailableClassesService() {
    if(this.woodForm.value.materiau === 'massif' || this.woodForm.value.materiau === 'lamelleColle' || this.woodForm.value.materiau === 'lvl') {
      if(this.kdefDetermine[this.woodForm.value.materiau]['1'])
        this.availableClassesService['1'] = true;

      if(this.kdefDetermine[this.woodForm.value.materiau]['2'])
        this.availableClassesService['2'] = true;

      if(this.kdefDetermine[this.woodForm.value.materiau]['3'])
        this.availableClassesService['3'] = true;
    } else if(this.woodForm.value.type) {
      if(this.kdefDetermine[this.woodForm.value.materiau][this.woodForm.value.type]['1'])
        this.availableClassesService['1'] = true;

      if(this.kdefDetermine[this.woodForm.value.materiau][this.woodForm.value.type]['2'])
        this.availableClassesService['2'] = true;

      if(this.kdefDetermine[this.woodForm.value.materiau][this.woodForm.value.type]['3'])
        this.availableClassesService['3'] = true;
    };
  }

  determineKdef() {
    if(this.woodForm.value.materiau === 'massif' || this.woodForm.value.materiau === 'lamelleColle' || this.woodForm.value.materiau === 'lvl') {
      this.kdef = this.kdefDetermine[this.woodForm.value.materiau][this.woodForm.value.classeService];
    } else {
      this.kdef = this.kdefDetermine[this.woodForm.value.materiau][this.woodForm.value.type][this.woodForm.value.classeService];
    };
  }

  determineKmod() {
    if(this.woodForm.value.materiau === 'massif' || this.woodForm.value.materiau === 'lamelleColle' || this.woodForm.value.materiau === 'lvl') {
      this.kmod = this.kmodDetermine[this.woodForm.value.materiau][this.woodForm.value.classeService][+this.woodForm.value.action];
    } else {
      this.kmod = this.kmodDetermine[this.woodForm.value.materiau][this.woodForm.value.type][this.woodForm.value.classeService][+this.woodForm.value.action];
    };
  }

  saveProject(): void {
    if(this.accountService.connected === true) {
      this.saveProject$ = this.http.post('https://calculs-structure.fr/app/save_project',{
        mail: this.accountService.userEmail,
        project: {
          name: this.woodStrengthDeformationService.projectName,
          tool: 'Résistance et déformation des éléments bois',
          projectDetails: {
            materiau: this.woodForm.value.materiau,
            type: this.woodForm.value.type,
            classeService: this.woodForm.value.type,
            action: this.woodForm.value.type
          }
        }
      },{responseType: 'text'}).pipe(
        tap(res => {
          if(res === 'ok') {
            this.projectSaved = true;
          } else {
            this.errorOnProjectSave = true;
          };
        })
      );
      this.saveProject$.subscribe();
    }
  }


}
