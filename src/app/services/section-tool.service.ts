import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class sectionToolService implements OnInit {
    sectionGeometry!: any;
    sectionThickness!: number;

    ngOnInit(): void {
        this.sectionThickness = 2;
        this.sectionGeometry = [
            {
                indice: 0,
                x: 0,
                y: 0
            },
            {
                indice: 1,
                x: 20,
                y: 40
            }
        ];
    }

    setGeometry(geometry: any): void {
        this.sectionGeometry = geometry;
    }
}