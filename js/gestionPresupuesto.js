let presupuesto = 0;
let gastos = [];
let contadorIds = 0;

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function actualizarPresupuesto(nuevoValor) {
  if (typeof nuevoValor !== "number" || nuevoValor < 0 || isNaN(nuevoValor)) {
    return -1;
  }
  presupuesto = nuevoValor;
  return presupuesto;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.descripcion = descripcion;
  this.valor = typeof valor === "number" && valor >= 0 && !isNaN(valor) ? valor : 0;
  if (fecha && !isNaN(Date.parse(fecha))) {
    this.fecha = Date.parse(fecha);
  } else {
    this.fecha = Date.now();
  }
  this.etiquetas = Array.isArray(etiquetas) ? etiquetas.flat() : [];

  this.mostrarGasto = function () {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
  };

  this.mostrarGastoCompleto = function () {
    const fechaLocal = new Date(this.fecha).toLocaleString();
    const etiquetasTexto =
      this.etiquetas.length > 0
        ? this.etiquetas.map(e => `- ${e}`).join("\n")
        : "";
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaLocal}\nEtiquetas:\n${etiquetasTexto}\n`;
  };

  this.actualizarDescripcion = function (nuevaDesc) {
    if (typeof nuevaDesc === "string" && nuevaDesc.trim() !== "") {
      this.descripcion = nuevaDesc;
    }
  };

  this.actualizarValor = function (nuevoValor) {
    if (typeof nuevoValor === "number" && nuevoValor >= 0 && !isNaN(nuevoValor)) {
      this.valor = nuevoValor;
    }
  };

  this.actualizarFecha = function (nuevaFecha) {
    if (!isNaN(Date.parse(nuevaFecha))) {
      this.fecha = Date.parse(nuevaFecha);
    }
  };

  this.anyadirEtiquetas = function (...nuevas) {
    nuevas.forEach(et => {
      if (!this.etiquetas.includes(et)) {
        this.etiquetas.push(et);
      }
    });
  };

  this.borrarEtiquetas = function (...aBorrar) {
    this.etiquetas = this.etiquetas.filter(e => !aBorrar.includes(e));
  };

  this.obtenerPeriodoAgrupacion = function (tipo) {
    const d = new Date(this.fecha);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    if (tipo === "anyo") return `${y}`;
    if (tipo === "mes") return `${y}-${m}`;
    return `${y}-${m}-${dia}`;
  };
}

function anyadirGasto(gasto) {
  gasto.id = contadorIds++;
  gastos.push(gasto);
}

function listarGastos() {
  return gastos;
}

function borrarGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
}

function calcularTotalGastos() {
  return gastos.reduce((acum, g) => acum + g.valor, 0);
}

function calcularBalance() {
  return presupuesto - calcularTotalGastos();
}

function filtrarGastos(filtros = {}) {
  return gastos.filter(g => {
    const f = new Date(g.fecha);
    if (filtros.fechaDesde && f < new Date(filtros.fechaDesde)) return false;
    if (filtros.fechaHasta && f > new Date(filtros.fechaHasta)) return false;
    if (filtros.valorMinimo != null && g.valor < filtros.valorMinimo) return false;
    if (filtros.valorMaximo != null && g.valor > filtros.valorMaximo) return false;
    if (filtros.descripcionContiene) {
      const txt = filtros.descripcionContiene.toLowerCase();
      if (!g.descripcion.toLowerCase().includes(txt)) return false;
    }
    if (filtros.etiquetasTiene && filtros.etiquetasTiene.length > 0) {
      const etiquetasG = g.etiquetas.map(e => e.toLowerCase());
      const coincide = filtros.etiquetasTiene.some(e => etiquetasG.includes(e.toLowerCase()));
      if (!coincide) return false;
    }
    return true;
  });
}

function agruparGastos(periodo, etiquetas = [], fechaDesde = null, fechaHasta = null) {
  let filtrados = gastos;
  if (etiquetas.length > 0) {
    filtrados = filtrados.filter(g => etiquetas.some(et => g.etiquetas.includes(et)));
  }
  if (fechaDesde) filtrados = filtrados.filter(g => g.fecha >= Date.parse(fechaDesde));
  if (fechaHasta) filtrados = filtrados.filter(g => g.fecha <= Date.parse(fechaHasta));
  const resultado = {};
  filtrados.forEach(g => {
    const clave = g.obtenerPeriodoAgrupacion(periodo);
    if (!resultado[clave]) resultado[clave] = 0;
    resultado[clave] += g.valor;
  });
  return resultado;
}

export {
  actualizarPresupuesto,
  mostrarPresupuesto,
  CrearGasto,
  anyadirGasto,
  listarGastos,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  filtrarGastos,
  agruparGastos
};