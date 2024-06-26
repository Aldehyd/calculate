import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable,tap } from 'rxjs';

@Component({
  selector: 'app-subscription-validated',
  standalone: true,
  imports: [RouterModule,HttpClientModule,CommonModule],
  templateUrl: './subscription-validated.component.html',
  styleUrl: './subscription-validated.component.scss'
})
export class SubscriptionValidatedComponent implements OnInit {

  validateSubscription$!: Observable<Object>;
  key!: string;
  isAccountActive!: boolean;

  constructor(
    private route:ActivatedRoute,
    private http:HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['key'];
   });
   console.log(this.route.params,this.key)
    this.validateSubscription$ = this.http.get(`https://calculs-structure.fr/app/validate_subscription?key=${this.key}`,{responseType: 'text'}).pipe(
      tap(res => {
        if(res !== null && res === 'ok') {
          this.isAccountActive = true;
        } else {
          this.isAccountActive = true;
        };
      })
    );
    this.validateSubscription$.subscribe();
  }
}
