import {
  CrearGasto,
  anyadirGasto,
  listarGastos,
  borrarGasto,
  calcularTotalGastos
} from "./gestionPresupuesto.js"; //Importa las funciones necesarioas desde gestionPresupuesto.js

const form = document.getElementById("formGasto"); //Obtiene referencias a los elementos del DOM    
const descripcion = document.getElementById("descripcion");
const valor = document.getElementById("valor");
const fecha = document.getElementById("fecha");
const etiquetas = document.getElementById("etiquetas");
const lista = document.getElementById("listaGastos");
const total = document.getElementById("total");


function mostrarGastos() {//funcion papa mostrar los castos en la interfaz
  const gastos = listarGastos(); //llama a la funcion listarGastos para obtener los gastos 
  lista.innerHTML = ""; //limpia la lista de gastos en el DOM 

  gastos.forEach(g => {// lista cada gasto y crea elementos li para cada uno
    const li = document.createElement("li");//crea un elementp li
    const fechaLocal = new Date(g.fecha).toLocaleDateString();//formatea la fecha
    li.textContent = `${g.descripcion} - ${g.valor} € - ${fechaLocal} - ${g.etiquetas.join(", ")}`;//establece el texto del li con la descripcion , valor ,fecha   y etiquetas del gasto

    
    const btnBorrar = document.createElement("button");// crea un boton de borrado para cada gasto
    btnBorrar.textContent = "Borrar";// establee el texto del boton
    btnBorrar.addEventListener("click", () => { // agrega un evento de click al boton para borrar el gasto correspondiente
      borrarGasto(g.id);//llama a la funcion borrarGasto con el id del gasto
      mostrarGastos();// actualiza la lista de gastos en la interfaz
    });

    li.appendChild(btnBorrar);//agreaga el boton de borrado al elemento li
    lista.appendChild(li);// agrega el elemento li a la lista de gastos en el DOM
  });

  total.textContent = calcularTotalGastos().toFixed(2);//actualiza el total de gastos en la interfaz
}


form.addEventListener("submit", (e) => {//agrega un evento de submit al formulario para añadir un  nuevo gasto
  e.preventDefault();//previene el comportamiento por defecto del formulario    
  const desc = descripcion.value.trim();//obtiene y limpia los valores de los campos del formulario
  const val = parseFloat(valor.value);//convierte el valor a nuemero de punto flotante
  const fec = fecha.value ? fecha.value : new Date().toISOString();// si no se proportciona una fecha , usa la fecha actual
  const etiq = etiquetas.value// obtiene y procesa las etiquetas
    ? etiquetas.value.split(",").map(e => e.trim())//separa las etiquetas por comas y las limpia 
    : [];//si no hay etiquetas , usa un array vacio

  const nuevoGasto = new CrearGasto(desc, val, fec, ...etiq);// crea una nueva lista de gastos con los valores obtenidos del formulario 
  anyadirGasto(nuevoGasto);// llama la funcion anyadirGastos para agregar el nuevo gasto a la lista
  form.reset();// resetea el formulario
  mostrarGastos();//actualiza la lista de gastos en la interfaz
});


mostrarGastos();//carga la lista inicial
