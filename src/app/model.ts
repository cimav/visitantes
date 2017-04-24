
export class Visitante {
  id: number;
  apellido: string;
  nombre: string;
  avatar: string;
  nota: string;
  empresa: string;
  random_num: number;
  tipo: number;
  constructor(_apellido: string, _nombre: string, _avatar: string) {
    this.apellido = _apellido;
    this.nombre = _nombre;
    this.avatar = _avatar;
    this.random_num = 0;
    this.tipo = 0;
  }

  visita: Visita;

  visitas: Visita[];
}

export class Visita {
  id: number;
  entrada: Date;
  salida: Date;
  nota: string;
  gafete: string;
  constructor(visitante_id: number) {
    this.visitante_id = visitante_id;
  }

  empleado: Empleado;
  empleado_id: number;

  visitante: Visitante;
  visitante_id: number;
}

export class Empleado {
  id: number;
  nombre: string
  constructor() {}
}

export class CameraData {
  base64: string;
  status: number;
  constructor(status: number, base64: string) {
    this.status = status;
    this.base64 = base64;
  }
}

export class TipoEmpleado {
  id: number;
  text: string;
  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }
}


