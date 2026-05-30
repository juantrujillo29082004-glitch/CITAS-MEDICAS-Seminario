/*
 * app.js – Lógica del CRUD de Citas Médicas usando localStorage
 * -----------------------------------------------------------
 * Cada cita se almacena como un objeto con la siguiente estructura:
 * {
 *   id: string (UUID),
 *   nombre: string,
 *   documento: string,
 *   medico: string,
 *   fecha: string (YYYY-MM-DD),
 *   hora: string (HH:MM),
 *   motivo: string,
 *   estado: string ('Pendiente' | 'Completada' | 'Cancelada')
 * }
 *
 * El array completo se guarda en localStorage bajo la clave "citas".
 * Todas las operaciones (crear, leer, actualizar, eliminar) manipulan este
 * array y luego vuelven a persistirlo.
 */

/**
 * Genera un identificador único (UUID v4) para cada cita.
 * No es crítico que sea criptográficamente seguro, solo que sea único.
 */
function generarId() {
    // https://stackoverflow.com/a/2117523/1123955
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Obtiene el listado de citas desde localStorage.
 * Si no existe nada, devuelve un array vacío.
 */
function obtenerCitas() {
    const data = localStorage.getItem('citas');
    return data ? JSON.parse(data) : [];
}

/**
 * Persiste el array de citas en localStorage.
 */
function guardarCitas(citas) {
    localStorage.setItem('citas', JSON.stringify(citas));
}

/**
 * Renderiza la tabla de citas en el DOM.
 * Aplica el filtro de búsqueda si está activo.
 */
function renderizarTabla() {
    const tbody = document.querySelector('#citas-table tbody');
    tbody.innerHTML = '';
    const filtro = document.getElementById('search-input').value.trim().toLowerCase();
    const citas = obtenerCitas();
    const filtradas = citas.filter(c => {
        const texto = `${c.nombre} ${c.documento}`.toLowerCase();
        return texto.includes(filtro);
    });
    filtradas.forEach(cita => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.documento}</td>
            <td>${cita.medico}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${cita.motivo}</td>
            <td>${renderizarBadge(cita.estado)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 action-btn" data-id="${cita.id}" data-action="edit">Editar</button>
                <button class="btn btn-sm btn-outline-danger action-btn" data-id="${cita.id}" data-action="delete">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Devuelve el HTML de un badge Bootstrap según el estado de la cita.
 */
function renderizarBadge(estado) {
    const colores = {
        Pendiente: 'warning',
        Completada: 'success',
        Cancelada: 'danger'
    };
    const clase = colores[estado] || 'secondary';
    return `<span class="badge bg-${clase}">${estado}</span>`;
}

/**
 * Valida el formulario antes de crear o actualizar una cita.
 * Además verifica la regla de negocio: un médico no puede tener dos citas
 * en la misma fecha y hora.
 */
function validarFormulario(citaAEditar = null) {
    const nombre = document.getElementById('nombre').value.trim();
    const documento = document.getElementById('documento').value.trim();
    const medico = document.getElementById('medico').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const motivo = document.getElementById('motivo').value.trim();

    if (!nombre || !documento || !medico || !fecha || !hora || !motivo) {
        alert('Todos los campos son obligatorios.');
        return false;
    }

    // No permitir fechas pasadas
    const hoy = new Date();
    const fechaSeleccionada = new Date(`${fecha}T${hora}`);
    if (fechaSeleccionada < hoy) {
        alert('La fecha y hora seleccionadas no pueden ser del pasado.');
        return false;
    }

    // Verificar conflicto de horario para el mismo médico
    const citas = obtenerCitas();
    const conflicto = citas.find(c => {
        if (citaAEditar && c.id === citaAEditar.id) return false; // excluir la propia al editar
        return c.medico === medico && c.fecha === fecha && c.hora === hora;
    });
    if (conflicto) {
        alert('El médico ya tiene una cita programada en esa fecha y hora.');
        return false;
    }

    return { nombre, documento, medico, fecha, hora, motivo };
}

/**
 * Maneja el envío del formulario para crear o actualizar una cita.
 */
function manejarSubmit(event) {
    event.preventDefault();
    const idEditando = document.getElementById('cita-form').dataset.editId;
    const datos = validarFormulario(idEditando ? { id: idEditando } : null);
    if (!datos) return; // la validación ya mostró un mensaje

    const citas = obtenerCitas();
    if (idEditando) {
        // Actualizar
        const indice = citas.findIndex(c => c.id === idEditando);
        if (indice !== -1) {
            citas[indice] = { ...citas[indice], ...datos, estado: citas[indice].estado };
        }
    } else {
        // Crear nueva cita con estado inicial "Pendiente"
        const nueva = { id: generarId(), ...datos, estado: 'Pendiente' };
        citas.push(nueva);
    }
    guardarCitas(citas);
    // Resetear formulario y salir de modo edición
    document.getElementById('cita-form').reset();
    delete document.getElementById('cita-form').dataset.editId;
    document.getElementById('submit-btn').textContent = 'Guardar Cita';
    renderizarTabla();
}

/**
 * Abre el formulario en modo edición con los datos de la cita seleccionada.
 */
function iniciarEdicion(id) {
    const cita = obtenerCitas().find(c => c.id === id);
    if (!cita) return;
    document.getElementById('nombre').value = cita.nombre;
    document.getElementById('documento').value = cita.documento;
    document.getElementById('medico').value = cita.medico;
    document.getElementById('fecha').value = cita.fecha;
    document.getElementById('hora').value = cita.hora;
    document.getElementById('motivo').value = cita.motivo;
    // Guardamos el id en el formulario para saber que estamos editando
    document.getElementById('cita-form').dataset.editId = id;
    document.getElementById('submit-btn').textContent = 'Actualizar Cita';
    // Opcional: scroll al formulario
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Muestra el modal de confirmación antes de eliminar una cita.
 */
function confirmarEliminacion(id) {
    const cita = obtenerCitas().find(c => c.id === id);
    if (!cita) return;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    document.getElementById('delete-paciente').textContent = cita.nombre;
    // Guardamos el id temporalmente en el botón de confirmación
    const btnConfirm = document.getElementById('confirm-delete');
    btnConfirm.dataset.id = id;
    modal.show();
}

/**
 * Elimina la cita después de la confirmación del usuario.
 */
function eliminarCita(id) {
    const citas = obtenerCitas().filter(c => c.id !== id);
    guardarCitas(citas);
    renderizarTabla();
}

/**
 * Delegación de eventos para los botones de acción en la tabla.
 */
function manejarAccionesTabla(event) {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const accion = btn.dataset.action;
    if (accion === 'edit') {
        iniciarEdicion(id);
    } else if (accion === 'delete') {
        confirmarEliminacion(id);
    }
}

/**
 * Inicializa la aplicación: listeners y renderizado inicial.
 */
function init() {
    document.getElementById('cita-form').addEventListener('submit', manejarSubmit);
    document.getElementById('search-input').addEventListener('input', renderizarTabla);
    document.querySelector('#citas-table tbody').addEventListener('click', manejarAccionesTabla);
    document.getElementById('confirm-delete').addEventListener('click', function () {
        const id = this.dataset.id;
        if (id) {
            eliminarCita(id);
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();
        }
    });
    renderizarTabla();
}

// Ejecutamos init cuando el DOM está listo
document.addEventListener('DOMContentLoaded', init);
