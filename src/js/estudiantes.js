
let lista = [
    { id: 1, nombre: "Ana Torres", doc: "1010", correo: "ana@mail.com", programa: "Ing. Sistemas", estado: "Activo" },
    { id: 2, nombre: "Luis Pérez", doc: "2020", correo: "luis@mail.com", programa: "Administración", estado: "Activo" },
    { id: 3, nombre: "María Gómez", doc: "3030", correo: "maria@mail.com", programa: "Contaduría", estado: "Inactivo" },
    { id: 4, nombre: "Carlos Ruiz", doc: "4040", correo: "carlos@mail.com", programa: "Derecho", estado: "Activo" },
    { id: 5, nombre: "Sofía López", doc: "5050", correo: "sofia@mail.com", programa: "Psicología", estado: "Activo" },
];

let idEdit = null;
let modalInstance = null;


function capDom() {
    return {
        btnAdd: document.getElementById("btn-add-estudiante"),
        tbody: document.getElementById("estudiantesBody"),
        modalEl: document.getElementById("estudianteModal"),
        modalLabel: document.getElementById("estudianteModalLabel"),
        form: document.getElementById("estudiante-form"),
        nombre: document.getElementById("est-nombre"),
        doc: document.getElementById("est-doc"),
        correo: document.getElementById("est-correo"),
        programa: document.getElementById("est-programa"),
        estado: document.getElementById("est-estado"),
        overlay: document.getElementById("loadingOverlay"),
        overlayMsg: document.getElementById("loadingMessage"),
    };
}


function pintar(dom) {
    dom.tbody.innerHTML = "";
    lista.forEach(e => {
        dom.tbody.innerHTML += `
      <tr>
        <td>${e.nombre}</td>
        <td>${e.doc}</td>
        <td>${e.correo}</td>
        <td>${e.programa}</td>
        <td>${e.estado}</td>
        <td>
          <button class="btn btn-sm btn-warning" data-id="${e.id}" data-accion="edit">Editar</button>
          <button class="btn btn-sm btn-danger" data-id="${e.id}" data-accion="del">Eliminar</button>
        </td>
      </tr>`;
    });
}


function formLeer(dom) {
    return {
        nombre: dom.nombre.value.trim(),
        doc: dom.doc.value.trim(),
        correo: dom.correo.value.trim(),
        programa: dom.programa.value.trim(),
        estado: dom.estado.value
    };
}

function formValidar(d) {
    return d.nombre && d.doc && d.correo && d.programa && d.estado;
}

function formLimpiar(dom) {
    dom.form.reset();
}

function formCargar(dom, obj) {
    dom.nombre.value = obj.nombre;
    dom.doc.value = obj.doc;
    dom.correo.value = obj.correo;
    dom.programa.value = obj.programa;
    dom.estado.value = obj.estado;
}


function agregar(d) {
    lista.push({ id: Date.now(), ...d });
}

function actualizar(id, d) {
    const i = lista.findIndex(e => e.id == id);
    lista[i] = { id, ...d };
}

function quitar(id) {
    lista = lista.filter(e => e.id != id);
}


async function abrirNuevo(dom) {
    cargaOn(dom, "Cargando formulario...");
    await esperar(800);
    idEdit = null;
    formLimpiar(dom);
    dom.modalLabel.textContent = "Nuevo Estudiante";
    modalInstance.show();
    cargaOff(dom);
}

async function abrirEditar(dom, id) {
    cargaOn(dom, "Cargando registro...");
    await esperar(800);
    const obj = lista.find(e => e.id == id);
    idEdit = id;
    formCargar(dom, obj);
    dom.modalLabel.textContent = "Editar Estudiante";
    modalInstance.show();
    cargaOff(dom);
}

async function guardar(dom, e) {
    e.preventDefault();
    cargaOn(dom, "Guardando...");
    await esperar(1000);

    const d = formLeer(dom);
    if (!formValidar(d)) return cargaOff(dom);

    if (idEdit === null) agregar(d);
    else actualizar(idEdit, d);

    pintar(dom);
    modalInstance.hide();
    cargaOff(dom);
}

async function eliminarConCarga(dom, id) {
    cargaOn(dom, "Eliminando...");
    await esperar(800);
    quitar(id);
    pintar(dom);
    cargaOff(dom);
}


function cargaOn(dom, msg) {
    dom.overlayMsg.textContent = msg;
    dom.overlay.style.display = "flex";
}
function cargaOff(dom) {
    dom.overlay.style.display = "none";
}
function esperar(msMax) {
    return new Promise(r => setTimeout(r, Math.random() * msMax));
}


function enlazar(dom) {
    dom.btnAdd.addEventListener("click", () => abrirNuevo(dom));

    dom.tbody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.dataset.accion === "edit") abrirEditar(dom, id);
        if (btn.dataset.accion === "del") eliminarConCarga(dom, id);
    });

    dom.form.addEventListener("submit", (e) => guardar(dom, e));
}


document.addEventListener("DOMContentLoaded", async () => {
    const dom = capDom();
    modalInstance = new bootstrap.Modal(dom.modalEl);

    cargaOn(dom, "Cargando estudiantes...");
    await esperar(1200);
    pintar(dom);
    cargaOff(dom);

    enlazar(dom);
});