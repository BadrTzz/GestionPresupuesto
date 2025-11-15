//importo las funciones necesarias desde gestionPresupuesto.js
import {
    CrearGasto,
    anyadirGasto,
    listarGastos,
    borrarGasto,
    calcularTotalGastos,
} from "./gestionPresupuesto.js"

//Obtiene referencias a los  elementos del dom
const form = document.getElementById("formGasto");
const descripcion = document.getElementById("descripcion");
const valor = document.getElementById("valor");
const fecha = document.getElementById("fecha");
const etiquetas = document.getElementById("etiquetas");
const lista = document.getElementById("listaGastos");
const total = document.getElementById("total");

// template del componenete <mi-gasto> contien  la estructura HTML y susstilos encapsulados
const  template = document.createElement("template");//creacion del elemento <template>
template.innerHTML = `
  <style>
    :host {
      display: block;
      background: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin: 5px 0;
      padding: 8px;
      font-family: sans-serif;
    }
    .fila {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #acciones button {
      margin-left: 0.5rem;
    }
    form {
      display: none;
      margin-top: 5px;
    }
    input {
      margin-right: 4px;
    }
  </style>
  
  <div class="fila">
    <div id="info">
      <strong id="desc"></strong> - <span id="valor"></span> €
      <div id="detalle"></div>
    </div>
    <div id="acciones">
      <button id="editarBtn">Editar</button>
      <button id="borrarBtn">Borrar</button>
    </div>
  </div>

  <form id="formEditar">
    <input type="text" id="descEdit" placeholder="Descripción" required>
    <input type="number" id="valorEdit" step="0.01" required>
    <input type="date" id="fechaEdit">
    <input type="text" id="etiqEdit" placeholder="Etiquetas separadas por comas">
    <button type="submit">Guardar</button>
    <button type="button" id="cancelarBtn">Cancelar</button>
  </form>
`;
//la definicion del componente web de <mi-gasto>
class MiGasto extends HTMLElement{
    constructor(){
        super(); //llamamos al constructor del HTMLElement
        this._shadow = this.attachShadow({mode: "open"}); // creea el shadow dom
        this._shadow.appendChild(template.content.cloneNode(true)); //clona  la plantilla del shadow root
    }

    connectedCallback(){
        // el momento  ene elque el componenete se inserta en el dom 
        this.gasto = JSON.parse(this.getAttribute("data-gasto"));
        this._render(); // llama al metodo que muestra la informacion
    }

    _render(){
        //metodo para mostrar la informacion del gasto 
        const gasto = this.gasto;
        // obtencion de los elementos del shadow dom 
        const descEl = this._shadow.getElementById("desc")
        const valEl = this._shadow.getElementById("valor")
        const detEl = this._shadow.getElementById("detalle")
        // formatea la fecha a formato local  dia/mes/año
        const fechalocal = new Date(gasto.fecha).toLocaleDateString();

        // se inserta la informacion en el HTML del componente
        descEl.textContent = gasto.descripcion;
        valEl.textContent = gasto.valor;
        detEl.textContent = '${fechalocal} · ${gasto.etiquetas.join}(", ")';
        //referencia   de los botones e formulareos de edicion dentro del shadow dom 
        const borrarBtn = this._shadow.getElementById("borrarBtn");
        const editarBtn = this._shadow.getElementById("editarBtn");
        const formEditar = this._shadow.getElementById("formEditar");
        const cancelarBtn = this._shadow.getElementById("cancelarBtn");

        //boton de borrar 
        borrarBtn.onclick = () => {
            borrarGasto(gasto.id);// elimina el gasto de la lista general
            document.dispatchEvent(new Event("gastoAcutalizado"));// lanza un evento  para avisar al resto  de la app de los  cambios que hay 
        };
        //boton para  cancelar
        cancelarBtn.onclick= () =>  (formEditar.style.display = "none");// oculta el formulario sin guardar cambios 

        // envio del formulartio de edicion 
        formEditar.onsubmit = e =>{
            e.preventDefault(); // evita recargar la pagina 
        
            //actualizamos las propiedades del objeto gasto
        gasto.descripcion = this._shadow.getElementById("descEdit").value.trim();
        gasto.valor = parseFloat(this._shadow.getElementById("valorEdit").value);
        gasto.fecha = Date.parse(this._shadow.getElementById("fechaEdit").value);
        gasto.etiquetas = this._shadow
        .getElementById("etiqEdit")
        .value.split(",") //Separanos las etiquetas por comas
        .map((e) => e.trim()) //quitamos los espacions 
        .filter(Boolean); //Eliminamos vacias 

        formEditar.style.display = "none"; //ocultamos el formulario de edicion 
        document.dispatchEvent(new Event("gastoActualizado"));//avisa a la app que se a actualizado  un gasto
        };
    }
}
//registr el nuebo elemento personalizado de <mi-gasto>
customElements.define("mi-gasto", MiGasto);

function renderizarGasto(){
    lista.innerHTML = ""; // se limpia la lista actual 
    listarGastos().forEach(g => {
        //Recorremos todos los gastos existentes
        const li = document.createElement("li");//creamos un elemento li para cada gasto
        const comp = document.createElement("mi-gasto");//crea una instancia del componente personalizado 
        comp.setAttribute("data-gasto", JSON.stringify(g));//le pasamos los datos del gasto como atributo
        li.appendChild(comp);//insertamos el componente dentro de li 
        lista.appendChild(li);//añadimos el li al listado general del dom
    });
    //mostramos el total actualizado de los gastos 
    total.textContent = calcularTotalGastos().toFixed(2);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();//evita el comportamiento por defecto  osea recargar pagina 
    //creamos un nuevo objeto gasto con los datos del  formulario
    const nuevo = new CrearGasto(
        descripcion.value.trim(),//descripcion limpia
        parseFloat(valor.value),//valor convertido a  numero 
        fecha.value || new Date().toISOString(), //si no hay fecha se usa la actual
        ...etiquetas.value.split(",").map(e => e.trim()).filter(Boolean) // separa etiquetas por comas 
        );

        anyadirGasto(nuevo);//añadimos el gasto al array global de gastos
        form.reset();//limpia el fromulario
        renderizarGasto(); //volvemos a mostrar los gastos actualizados 
});
// cuando se dispara el evento personalizado de gastoactualizado recargamos la lista 
document.addEventListener("gastoActualizado", renderizarGasto);
//mostramos los gastos iniciale si hay 
renderizarGasto();


