import { Injectable, OnInit } from "@angular/core";
import { Point } from "../models/point.model";
@Injectable({
    providedIn: 'root'
})
export class sectionToolService implements OnInit {
    projectName!: string;
    projectShape!: string;
    sectionGeometry!: Point[];
    sectionThickness!: number;
    coorMax!: number;
    pointsSvgAttribute!: string;

    ngOnInit(): void {
        this.sectionThickness = 2;
        this.sectionGeometry = [];
    }
}