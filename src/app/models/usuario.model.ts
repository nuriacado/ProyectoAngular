export class UsuarioModel {
    constructor(
        public email: string,
        public nombre: string,
        public apellidos: string,
        public telefono: string,
        public contrasena: string,
        public rol: string,
        public id?: string,
        public fechaNacimiento?: Date,
        public genero?: string,
        public comunidad?: string,
    ) {}
}