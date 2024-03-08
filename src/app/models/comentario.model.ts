export class ComentarioModel {
    constructor(
        public id: string,
        public idUsuario: string,
        public idLugar: number,
        public puntuacion: number,
        public comentario: string
    ) {}
}

