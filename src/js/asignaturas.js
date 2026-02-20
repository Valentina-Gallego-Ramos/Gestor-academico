

let lista = [];
let modoEdicion = false;
let idEditando = null;
let modalInstance = null;

document.addEventListener("DOMContentLoaded", () => {

    const dom = {
        btnAdd: document.getElementById("btn-add-asignatura"),
        tbody: document.getElementById("asignaturasBody"),
        modalEl: document.getElementById("asignaturaModal"),
        modalLabel: document.getElementById("asignaturaModalLabel"),
        form: document.getElementById("asignatura-form"),
        codigo: document.getElementById("asi-codigo"),
        nombre: document.getElementById("asi-nombre"),
        creditos: document.getElementById("asi-creditos"),
        docente: document.getElementById("asi-docente"),
        estado: document.getElementById("asi-estado"),
        overlay: document.getElementById("loadingOverlay"),
        overlayMsg: document.getElementById("loadingMessage")
    };

    modalInstance = new bootstrap.Modal(dom.modalEl);



    mostrarOverlay(dom, "Cargando asignaturas...");

    setTimeout(() => {
        lista = [
            { id: 1, codigo: "PROG1", nombre: "Programación I", creditos: 3, docente: "Carlos Gómez", estado: "Activa" },
            { id: 2, codigo: "CALC1", nombre: "Cálculo Diferencial", creditos: 4, docente: "Laura Martínez", estado: "Activa" },
            { id: 3, codigo: "BD1", nombre: "Bases de Datos", creditos: 3, docente: "Andrés López", estado: "Activa" },
            { id: 4, codigo: "ETICA", nombre: "Ética Profesional", creditos: 2, docente: "María Torres", estado: "Inactiva" },
            { id: 5, codigo: "FIS1", nombre: "Física I", creditos: 4, docente: "Jorge Ramírez", estado: "Activa" }
        ];

        pintar(dom);
        ocultarOverlay(dom);
    }, 1000);



    dom.btnAdd.addEventListener("click", () => abrirNuevo(dom));

    dom.form.addEventListener("submit", (e) => {
        e.preventDefault();
        guardar(dom);
    });

    dom.tbody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const id = parseInt(btn.dataset.id);
        const accion = btn.dataset.accion;

        if (accion === "edit") editar(dom, id);
        if (accion === "del") eliminar(dom, id);
    });

});




function mostrarOverlay(dom, mensaje) {
    dom.overlayMsg.textContent = mensaje;
    dom.overlay.style.display = "flex";
}

function ocultarOverlay(dom) {
    dom.overlay.style.display = "none";
}

function pintar(dom) {
    dom.tbody.innerHTML = "";

    lista.forEach(a => {
        dom.tbody.innerHTML += `
            <tr>
                <td>${a.codigo}</td>
                <td>${a.nombre}</td>
                <td>${a.creditos}</td>
                <td>${a.docente}</td>
                <td>${a.estado}</td>
                <td>
                    <button class="btn btn-sm btn-warning" data-id="${a.id}" data-accion="edit">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" data-id="${a.id}" data-accion="del">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

function abrirNuevo(dom) {
    modoEdicion = false;
    idEditando = null;

    dom.modalLabel.textContent = "Nueva Asignatura";
    dom.form.reset();

    mostrarOverlay(dom, "Cargando formulario...");

    setTimeout(() => {
        ocultarOverlay(dom);
        modalInstance.show();
    }, 600);
}

function editar(dom, id) {
    mostrarOverlay(dom, "Cargando registro...");

    setTimeout(() => {
        const asignatura = lista.find(a => a.id === id);

        if (!asignatura) return;

        modoEdicion = true;
        idEditando = id;

        dom.modalLabel.textContent = "Editar Asignatura";

        dom.codigo.value = asignatura.codigo;
        dom.nombre.value = asignatura.nombre;
        dom.creditos.value = asignatura.creditos;
        dom.docente.value = asignatura.docente;
        dom.estado.value = asignatura.estado;

        ocultarOverlay(dom);
        modalInstance.show();

    }, 600);
}

function guardar(dom) {

    mostrarOverlay(dom, "Guardando...");

    setTimeout(() => {

        const datos = {
            codigo: dom.codigo.value,
            nombre: dom.nombre.value,
            creditos: parseInt(dom.creditos.value),
            docente: dom.docente.value,
            estado: dom.estado.value
        };

        if (modoEdicion) {

            const index = lista.findIndex(a => a.id === idEditando);
            lista[index] = { ...lista[index], ...datos };

        } else {

            const nuevo = {
                id: Date.now(),
                ...datos
            };

            lista.push(nuevo);
        }

        pintar(dom);
        modalInstance.hide();
        ocultarOverlay(dom);

    }, 800);
}

function eliminar(dom, id) {

    if (!confirm("¿Deseas eliminar esta asignatura?")) return;

    mostrarOverlay(dom, "Eliminando...");

    setTimeout(() => {
        lista = lista.filter(a => a.id !== id);
        pintar(dom);
        ocultarOverlay(dom);
    }, 600);
}