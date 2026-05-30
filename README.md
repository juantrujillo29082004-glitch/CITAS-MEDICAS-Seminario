# 🏥 Sistema de Agendamiento de Citas Médicas

Este proyecto es una aplicación web tipo **CRUD** (Create, Read, Update, Delete) desarrollada de manera guiada utilizando herramientas de Inteligencia Artificial como asistente cognitivo y co-diseñador. Ha sido diseñado específicamente como **Trabajo Final Universitario** para demostrar la viabilidad, optimización y velocidad de iteración que ofrece el desarrollo de software asistido por IA en entornos de aprendizaje y metodologías ágiles.

La aplicación permite gestionar el ciclo completo de agendamiento de citas médicas en un entorno clínico simulado, priorizando una interfaz intuitiva, moderna y completamente accesible desde dispositivos móviles.

---

## 🚀 Características y Funcionalidades (Módulo CRUD)

La aplicación implementa las cuatro operaciones fundamentales de la persistencia de datos junto con reglas lógicas de negocio:

1. **Crear (Create):** Formulario automatizado para el registro de citas médicas. Cuenta con validación estricta de campos obligatorios y un **algoritmo de detección de colisiones horarias** (evita que un mismo médico sea agendado en la misma fecha y hora exacta).
2. **Leer y Buscar (Read):** Tablero dinámico que lista todas las citas programadas. Cada registro incluye un indicador visual de estado (*Pendiente, Completada, Cancelada*) mediante etiquetas de color. Incorpora un **buscador en tiempo real** por nombre o documento de identidad del paciente.
3. **Actualizar (Update):** Ventana modal interactiva que recupera la información de una cita existente para modificar cualquiera de sus campos, incluyendo la actualización inmediata del estado de la consulta.
4. **Eliminar (Delete):** Mecanismo de cancelación definitiva del registro asistido por un cuadro de diálogo de confirmación para prevenir pérdidas accidentales de información.

---

## 🛠️ Stack Tecnológico y Justificación Arquitectónica

Para garantizar la máxima portabilidad, ligereza y facilidad de despliegue, el proyecto se construyó utilizando una arquitectura **Serverless / Client-side** (sin dependencias de servidores externos):

* **HTML5:** Estructuración semántica y accesible de los formularios y componentes de la interfaz.
* **Bootstrap 5 (vía CDN):** Framework de estilos para lograr un diseño responsivo (*Mobile-First*), limpio y con una estética visual profesional adaptada al sector salud (tonos clínicos y legibilidad alta).
* **JavaScript Vanilla (ES6+):** Programación modular y pura, encargada de la lógica del negocio, manipulación dinámica del DOM y validaciones sin necesidad de frameworks complejos.
* **Web Storage API (localStorage):** Elección estratégica para la persistencia de datos. Almacena la información directamente en el navegador del usuario en formato JSON, permitiendo que la aplicación sea 100% funcional de forma local e inmediata.

---

## 📁 Estructura del Proyecto

El repositorio mantiene una estructura monolítica SPA (Single Page Application) limpia y de fácil mantenimiento:

```text
├── index.html   # Estructura principal de la interfaz web y modales de Bootstrap
├── style.css    # Refinamientos estéticos y personalización de temas clínicos
├── app.js       # Lógica del CRUD, manejo de localStorage y validaciones (Hipercomentado)
└── README.md    # Documentación general del repositorio
