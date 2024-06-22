import { Injectable, OnInit } from "@angular/core";
import { Point } from "../models/point.model";
import { AnalyzedSection } from "../models/analyzedSection.model";
import { SectionArea } from "../models/section-area.model";

interface NetSectionSvgCoorInterface {
    be1: string,
    be2: string,
    ceff: string,
    he1: string,
    he2: string,
    other: string
}
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
    netSectionSvgCoor!: NetSectionSvgCoorInterface;
    modifyProject!: boolean;


    ngOnInit(): void {
    }
}