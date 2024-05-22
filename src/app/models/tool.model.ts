
export class Tool {
    constructor(
        public id: number,
        public title: string, 
        public description: string,
        public norm: string,
        public detailsHidden?: boolean) {
            this.detailsHidden = false;
        }
}