export class ComentarioModel {
    constructor(
        public idUsuario: string,
        public idLugar: number,
        public puntuacion: number,
        public comentario: string,
        public id?: string,
    ) {}
}

