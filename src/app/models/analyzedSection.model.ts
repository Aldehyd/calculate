export class AnalyzedSection {
    constructor(
        public thickness : number,
        public roundCorner: number,
        public pointsNumber: number,
        public wallsNumber: number,
        public xSymetry: {
            isXSymetric: boolean,
            axeYCoor: number
        },
        public topWing : {
            start : {
                index: number,
                x: number,
                y: number
            },
            end : {
                index: number,
                x: number,
                y: number
            },
            length: number,
            angle: number,
            stiffener: {
                type: string,
                compliant: boolean,
                walls: {start: number, end:number, length: number, angle: number, verticalLength: number}[]
            },
            compliant: boolean
        },
        public bottomWing : {
            start : {
                index: number,
                x: number,
                y: number
            },
            end : {
                index: number
                x: number,
                y: number
            },
            length: number,
            angle: number,
            stiffener: {
                type: string,
                compliant: boolean,
                walls: {start:number, end:number, length: number, angle: number, verticalLength: number}[]
            },
            compliant: boolean
        },
        public web: {
            start : {
                index: number,
                x: number,
                y: number
            },
            end : {
                index: number,
                x: number,
                y: number
            },
            length: number,
            compliant: boolean
        },
    ) {}
    
}