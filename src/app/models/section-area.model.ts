export class SectionArea {
    constructor(
        public gammaM0: number,
        public E: number,
        public nu: number,
        public epsilon: number,
        public r: number,
        public t: number,
        public rm: number,
        public Psy: number,
        public gr: number,
        public topWing: {
            b: number,
            bp: number,
            c: number,
            bpc: number,
            phi: number,
            stiffener: {
                ksigma: number,
                lambdarhoc: number,
                rho: number,
                daa: number,
                Is: number,
                sigma1: number,
                sigma2: number,
                Psi: number,
                tred: number
            },
            wing: {
                ksigma: number,
                lambdarhoc: number,
                rho: number,
            },
            ceff: number,
            beff: number,
            be1: number,
            be2: number,
            As: number,
            b1: number,
            kf: number,
            K1: number,
            sigmacrs: number,
            lambdad: number,
            Chid: number,
            lambdapb: number,
            lambdapbred: number,
            lambdapc: number,
            lambdapcred: number
        },
        public web: {
            hw: number,
            bp: number,
            roundCornerNeglected: boolean,
            hp: number,
            bp2: number,
            be1: number,
            be2: number,
            ceff: number,
            Chid: number,
            cp: number,
            hc: number,
            Psi: number,
            ksigma: number,
            lambdap: number,
            rho: number
            beff: number
        }
    ) {}
}