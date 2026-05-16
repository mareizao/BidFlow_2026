export const licitacionesMock = [
  {
    id: "BID-2023-089",
    nombre: "Modernización Infraestructura IT",
    estado: "Abierta",
    sme: "Carlos Mendoza",
    progreso: 45,
    fecha: "24 Oct 2023",
    descripcion: "Actualización completa de servidores y red corporativa.",
    tareas: [
      { id: 1, titulo: "Relevamiento técnico", completada: true },
      { id: 2, titulo: "Propuesta económica", completada: false },
      { id: 3, titulo: "Revisión legal", completada: false },
    ],
  },
  {
    id: "BID-2023-088",
    nombre: "Provisión Servicios Cloud Q4",
    estado: "En Revisión",
    sme: "Ana Silveira",
    progreso: 90,
    fecha: "22 Oct 2023",
    descripcion: "Migración de servicios on-premise a AWS.",
    tareas: [
      { id: 4, titulo: "Análisis de costos", completada: true },
      { id: 5, titulo: "Aprobación de arquitectura", completada: true },
      { id: 6, titulo: "Firma de contrato", completada: false },
    ],
  },
  {
    id: "BID-2023-087",
    nombre: "Consultoría Seguridad Ciberfísica",
    estado: "Cerrada",
    sme: "Roberto Gómez",
    progreso: 100,
    fecha: "15 Oct 2023",
    descripcion: "Auditoría y plan de mejora de seguridad.",
    tareas: [
      { id: 7, titulo: "Auditoría inicial", completada: true },
      { id: 8, titulo: "Informe final", completada: true },
    ],
  },
  {
    id: "BID-2023-086",
    nombre: "Suministro Equipos Red",
    estado: "Abierta",
    sme: "Laura Torres",
    progreso: 15,
    fecha: "25 Oct 2023",
    descripcion: "Adquisición de switches, routers y cableado.",
    tareas: [
      { id: 9, titulo: "Solicitud de cotizaciones", completada: true },
      { id: 10, titulo: "Evaluación de proveedores", completada: false },
    ],
  },
]

export const usuarioMock = {
  nombre: "Ana García",
  rol: "Pre-sales",
  iniciales: "AG",
}