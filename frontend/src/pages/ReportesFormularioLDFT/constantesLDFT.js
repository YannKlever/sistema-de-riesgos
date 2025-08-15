export const COLUMNAS_REPORTE_LDFT = [
    { id: 'fecha_evaluacion', nombre: 'Fecha Evaluación' },
    { id: 'usuario', nombre: 'Usuario' },
    
    // Sección 1: Administración del Riesgo
    { id: 'p1_1', nombre: '1.1 - Área independiente LGI/FT/DP' },
    { id: 'p1_1_numerico', nombre: '1.1 - Valor' },
    { id: 'p1_2', nombre: '1.2 - Implementación gestión riesgos' },
    { id: 'p1_2_numerico', nombre: '1.2 - Valor' },
    
    // Sección 2: Involucramiento de la Administración
    { id: 'p2_1', nombre: '2.1 - Políticas y procedimientos' },
    { id: 'p2_1_numerico', nombre: '2.1 - Valor' },
    { id: 'p2_2', nombre: '2.2 - Apoyo al Oficial de Cumplimiento' },
    { id: 'p2_2_numerico', nombre: '2.2 - Valor' },
    { id: 'p2_3', nombre: '2.3 - Gestión información empleados' },
    { id: 'p2_3_numerico', nombre: '2.3 - Valor' },
    
    // Sección 3: Política "Conozca a su Cliente"
    { id: 'p3_1', nombre: '3.1 - Identificación de clientes' },
    { id: 'p3_1_numerico', nombre: '3.1 - Valor' },
    { id: 'p3_2', nombre: '3.2 - Registro clientes/transacciones' },
    { id: 'p3_2_numerico', nombre: '3.2 - Valor' },
    { id: 'p3_3', nombre: '3.3 - Frecuencia actualización' },
    { id: 'p3_3_numerico', nombre: '3.3 - Valor' },
    
    // Sección 4: Monitoreo de Transacciones
    { id: 'p4_1', nombre: '4.1 - Herramientas de monitoreo' },
    { id: 'p4_1_numerico', nombre: '4.1 - Valor' },
    { id: 'p4_2', nombre: '4.2 - Detección transacciones inusuales' },
    { id: 'p4_2_numerico', nombre: '4.2 - Valor' },
    { id: 'p4_3', nombre: '4.3 - Gestión transacciones sospechosas' },
    { id: 'p4_3_numerico', nombre: '4.3 - Valor' },
    
    // Sección 5: Gestión del Oficial de Cumplimiento
    { id: 'p5_1', nombre: '5.1 - Perfil y jerarquía' },
    { id: 'p5_1_numerico', nombre: '5.1 - Valor' },
    { id: 'p5_2', nombre: '5.2 - Cumplimiento de funciones' },
    { id: 'p5_2_numerico', nombre: '5.2 - Valor' },
    { id: 'p5_3', nombre: '5.3 - Reporte al Directorio' },
    { id: 'p5_3_numerico', nombre: '5.3 - Valor' },
    
    // Sección 6: Programas de Capacitación
    { id: 'p6_1', nombre: '6.1 - Programa de capacitación' },
    { id: 'p6_1_numerico', nombre: '6.1 - Valor' },
    { id: 'p6_2', nombre: '6.2 - Registro y evaluación' },
    { id: 'p6_2_numerico', nombre: '6.2 - Valor' },
    { id: 'p6_3', nombre: '6.3 - Identificación necesidades' },
    { id: 'p6_3_numerico', nombre: '6.3 - Valor' },
    
    // Sección 7: Programas de Auditoría
    { id: 'p7_1', nombre: '7.1 - Auditoría de controles' },
    { id: 'p7_1_numerico', nombre: '7.1 - Valor' },
    { id: 'p7_2', nombre: '7.2 - Auditoría especializada' },
    { id: 'p7_2_numerico', nombre: '7.2 - Valor' },
    
    // Sección 8: Vulnerabilidades en Debida Diligencia
    { id: 'p8_1', nombre: '8.1 - Frecuencia actualización criterios' },
    { id: 'p8_1_numerico', nombre: '8.1 - Valor' },
    { id: 'p8_2', nombre: '8.2 - Verificación información clientes' },
    { id: 'p8_2_numerico', nombre: '8.2 - Valor' },
    { id: 'p8_3', nombre: '8.3 - Manejo inconsistencias' },
    { id: 'p8_3_numerico', nombre: '8.3 - Valor' },
    
    // Sección 9: Vulnerabilidades en Controles Internos
    { id: 'p9_1', nombre: '9.1 - Cumplimiento procedimientos' },
    { id: 'p9_1_numerico', nombre: '9.1 - Valor' },
    { id: 'p9_2', nombre: '9.2 - Respuesta a fallas' },
    { id: 'p9_2_numerico', nombre: '9.2 - Valor' },
    { id: 'p9_3', nombre: '9.3 - Manejo casos excepcionales' },
    { id: 'p9_3_numerico', nombre: '9.3 - Valor' },
    
    { id: 'promedio_riesgo', nombre: 'Promedio de Riesgo' }
];

export const COLUMNAS_NUMERICAS_LDFT = COLUMNAS_REPORTE_LDFT.filter(col => col.id.endsWith('_numerico'));