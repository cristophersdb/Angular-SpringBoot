export interface RespCliente {
  cliente: Cliente;
  message: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  createAt?: string;
}
