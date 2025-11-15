let presupuesto = 0;
let gastos = [];
let contadorIds = 0;

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function actualizarPresupuesto(nuevoValor) {
  if (typeof nuevoValor !== "number" || nuevoValor < 0 || isNaN(nuevoValor)) return -1;
  presupuesto = nuevoValor;
  return presupuesto;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.descripcion = descripcion;
  this.valor = typeof valor === "number" && valor >= 0 && !isNaN(valor) ? valor : 0;
  this.fecha = fecha && !isNaN(Date.parse(fecha)) ? Date.parse(fecha) : Date.now();
  this.etiquetas = Array.isArray(etiquetas) ? etiquetas.flat() : [];
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

function actualizarGasto(id, datos) {
  const g = gastos.find(x => x.id === id);
  if (!g) return;
  g.descripcion = datos.descripcion;
  g.valor = datos.valor;
  g.fecha = datos.fecha;
  g.etiquetas = datos.etiquetas;
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
      const et = g.etiquetas.map(e => e.toLowerCase());
      const match = filtros.etiquetasTiene.some(x => et.includes(x.toLowerCase()));
      if (!match) return false;
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
    const d = new Date(g.fecha);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    let clave = "";
    if (periodo === "anyo") clave = `${y}`;
    else if (periodo === "mes") clave = `${y}-${m}`;
    else clave = `${y}-${m}-${dia}`;
    if (!resultado[clave]) resultado[clave] = 0;
    resultado[clave] += g.valor;
  });
  return resultado;
}

function sobrescribirGastos(nuevos) {
  gastos = nuevos;
  contadorIds = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 0;
}

export {
  actualizarPresupuesto,
  mostrarPresupuesto,
  CrearGasto,
  anyadirGasto,
  listarGastos,
  borrarGasto,
  actualizarGasto,
  calcularTotalGastos,
  calcularBalance,
  filtrarGastos,
  agruparGastos,
  sobrescribirGastos
};
