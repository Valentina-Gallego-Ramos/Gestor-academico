

let lista = [];
let modoEdicion = false;
let idEditando = null;
let modalInstance = null;

document.addEventListener("DOMContentLoaded", () => {

    const dom = {
        btnAdd: document.getElementById("btn-add-nota"),
        tbody: document.getElementById("notasBody"),
        modalEl: document.getElementById("notaModal"),
        modalLabel: document.getElementById("notaModalLabel"),
        form: document.getElementById("nota-form"),
        estudiante: document.getElementById("not-estudiante"),
        asignatura: document.getElementById("not-asignatura"),
        nota: document.getElementById("not-nota"),
        fecha: document.getElementById("not-fecha"),
        obs: document.getElementById("not-obs"),
        overlay: document.getElementById("loadingOverlay"),
        overlayMsg: document.getElementById("loadingMessage")
    };

    modalInstance = new bootstrap.Modal(dom.modalEl);



    mostrarOverlay(dom, "Cargando notas...");

    setTimeout(() => {
        lista = [
            { id: 1, estudiante: "Juan Pérez", asignatura: "Programación I", nota: 4.5, fecha: "2026-02-10", obs: "Buen desempeño" },
            { id: 2, estudiante: "Amanda Miguel", asignatura: "Cálculo Diferencial", nota: 3.8, fecha: "2026-02-12", obs: "Debe practicar más" },
            { id: 3, estudiante: "Carlitos Perez", asignatura: "Bases de Datos", nota: 4.9, fecha: "2026-02-14", obs: "Excelente trabajo" }
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

    lista.forEach(n => {
        dom.tbody.innerHTML += `
            <tr>
                <td>${n.estudiante}</td>
                <td>${n.asignatura}</td>
                <td>${n.nota}</td>
                <td>${n.fecha}</td>
                <td>${n.obs || ""}</td>
                <td>
                    <button class="btn btn-sm btn-warning" data-id="${n.id}" data-accion="edit">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" data-id="${n.id}" data-accion="del">
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

    dom.modalLabel.textContent = "Registrar Nota";
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

        const nota = lista.find(n => n.id === id);
        if (!nota) return;

        modoEdicion = true;
        idEditando = id;

        dom.modalLabel.textContent = "Editar Nota";

        dom.estudiante.value = nota.estudiante;
        dom.asignatura.value = nota.asignatura;
        dom.nota.value = nota.nota;
        dom.fecha.value = nota.fecha;
        dom.obs.value = nota.obs;

        ocultarOverlay(dom);
        modalInstance.show();

    }, 600);
}

function guardar(dom) {

    mostrarOverlay(dom, "Guardando...");

    setTimeout(() => {

        const datos = {
            estudiante: dom.estudiante.value,
            asignatura: dom.asignatura.value,
            nota: parseFloat(dom.nota.value),
            fecha: dom.fecha.value,
            obs: dom.obs.value
        };

        if (modoEdicion) {

            const index = lista.findIndex(n => n.id === idEditando);
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

    if (!confirm("¿Deseas eliminar esta nota?")) return;

    mostrarOverlay(dom, "Eliminando...");

    setTimeout(() => {
        lista = lista.filter(n => n.id !== id);
        pintar(dom);
        ocultarOverlay(dom);
    }, 600);
}