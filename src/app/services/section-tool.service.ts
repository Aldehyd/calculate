import { Injectable, OnInit } from "@angular/core";
import { Point } from "../models/point.model";
import { AnalyzedSection } from "../models/analyzedSection.model";
import { SectionArea } from "../models/section-area.model";
@Injectable({
    providedIn: 'root'
})
export class sectionToolService implements OnInit {
    projectName!: string;
    projectShape!: string;
    sectionGeometry!: Point[];
    sectionThickness!: number;
    roundCorner!: number;
    coorMax!: number;
    pointsSvgAttribute!: string;
    analyzedSection!: AnalyzedSection;
    sectionArea!: SectionArea;
    sollicitationType!: string;
    elasticLimit!: number;

    modifyProject!: boolean;

    ngOnInit(): void {
        this.modifyProject = false;
        this.sectionThickness = 2;
        this.roundCorner = 4;
        this.sectionGeometry = [];
    }
}