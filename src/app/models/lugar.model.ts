export class LugarModel {
    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public horario: string,
        public imagenes: string[],
        public puntuacion?: number,
        public opiniones?: []
    ) {}
}