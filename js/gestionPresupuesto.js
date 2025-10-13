let presupuesto = 0;

function actualizarPresupuesto(nuevoValor) {
  if (typeof nuevoValor !== "number" || nuevoValor < 0) {
    console.log("Presupuesto no válido");
    return -1;
  }
  presupuesto = nuevoValor;
  return presupuesto;
}

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor) {
  if (typeof valor !== "number" || valor < 0) {
    valor = 0;
  }
  this.descripcion = descripcion;
  this.valor = valor;
}

CrearGasto.prototype.mostrarGasto = function () {
  return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
};

CrearGasto.prototype.actualizarDescripcion = function (nuevaDescripcion) {
  this.descripcion = nuevaDescripcion;
};

CrearGasto.prototype.actualizarValor = function (nuevoValor) {
  if (typeof nuevoValor === "number" && nuevoValor >= 0) {
    this.valor = nuevoValor;
  }
};

module.exports = {
  actualizarPresupuesto,
  mostrarPresupuesto,
  CrearGasto,
};
