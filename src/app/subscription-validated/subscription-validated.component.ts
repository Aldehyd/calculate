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
    this.validateSubscription$ = this.http.get(`http://localhost:4000/app/validate_subscription?key=${this.route.snapshot.queryParams['key']}`,{responseType: 'text'}).pipe(
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
