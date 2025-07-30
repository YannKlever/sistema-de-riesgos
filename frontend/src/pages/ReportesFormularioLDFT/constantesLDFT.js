export const COLUMNAS_REPORTE_LDFT = [
    { id: 'fecha_evaluacion', nombre: 'Fecha Evaluación' },
    { id: 'usuario', nombre: 'Usuario' },
    
    // Sección 1: Administración del Riesgo de LD/FT
    { id: 'p1_1', nombre: 'P1.1 - Existencia de políticas' },
    { id: 'p1_1_numerico', nombre: 'P1.1 - Valor' },
    { id: 'p1_2', nombre: 'P1.2 - Actualización periódica' },
    { id: 'p1_2_numerico', nombre: 'P1.2 - Valor' },
    
    // Sección 2: Involucramiento de la Administración
    { id: 'p2_1', nombre: 'P2.1 - Participación' },
    { id: 'p2_1_numerico', nombre: 'P2.1 - Valor' },
    { id: 'p2_2', nombre: 'P2.2 - Revisión' },
    { id: 'p2_2_numerico', nombre: 'P2.2 - Valor' },
    { id: 'p2_3', nombre: 'P2.3 - Comunicación' },
    { id: 'p2_3_numerico', nombre: 'P2.3 - Valor' },
    
    // Sección 3: Política "Conozca a su Cliente"
    { id: 'p3_1', nombre: 'P3.1 - Documentación' },
    { id: 'p3_1_numerico', nombre: 'P3.1 - Valor' },
    { id: 'p3_2', nombre: 'P3.2 - Verificación' },
    { id: 'p3_2_numerico', nombre: 'P3.2 - Valor' },
    { id: 'p3_3', nombre: 'P3.3 - Actualización' },
    { id: 'p3_3_numerico', nombre: 'P3.3 - Valor' },
    
    // Sección 4: Monitoreo de Transacciones
    { id: 'p4_1', nombre: 'P4.1 - Sistemas de monitoreo' },
    { id: 'p4_1_numerico', nombre: 'P4.1 - Valor' },
    { id: 'p4_2', nombre: 'P4.2 - Reportes inusuales' },
    { id: 'p4_2_numerico', nombre: 'P4.2 - Valor' },
    { id: 'p4_3', nombre: 'P4.3 - Acciones correctivas' },
    { id: 'p4_3_numerico', nombre: 'P4.3 - Valor' },
    
    // Sección 5: Gestión del Oficial de Cumplimiento
    { id: 'p5_1', nombre: 'P5.1 - Designación' },
    { id: 'p5_1_numerico', nombre: 'P5.1 - Valor' },
    { id: 'p5_2', nombre: 'P5.2 - Independencia' },
    { id: 'p5_2_numerico', nombre: 'P5.2 - Valor' },
    { id: 'p5_3', nombre: 'P5.3 - Recursos' },
    { id: 'p5_3_numerico', nombre: 'P5.3 - Valor' },
    
    // Sección 6: Programas de Capacitación
    { id: 'p6_1', nombre: 'P6.1 - Frecuencia' },
    { id: 'p6_1_numerico', nombre: 'P6.1 - Valor' },
    { id: 'p6_2', nombre: 'P6.2 - Contenido' },
    { id: 'p6_2_numerico', nombre: 'P6.2 - Valor' },
    { id: 'p6_3', nombre: 'P6.3 - Registros' },
    { id: 'p6_3_numerico', nombre: 'P6.3 - Valor' },
    
    // Sección 7: Programas de Auditoría
    { id: 'p7_1', nombre: 'P7.1 - Independencia' },
    { id: 'p7_1_numerico', nombre: 'P7.1 - Valor' },
    { id: 'p7_2', nombre: 'P7.2 - Seguimiento' },
    { id: 'p7_2_numerico', nombre: 'P7.2 - Valor' },
    
    // Sección 8: Vulnerabilidades en el Proceso de Debida Diligencia
    { id: 'p8_1', nombre: 'P8.1 - Identificación' },
    { id: 'p8_1_numerico', nombre: 'P8.1 - Valor' },
    { id: 'p8_2', nombre: 'P8.2 - Medición' },
    { id: 'p8_2_numerico', nombre: 'P8.2 - Valor' },
    { id: 'p8_3', nombre: 'P8.3 - Mitigación' },
    { id: 'p8_3_numerico', nombre: 'P8.3 - Valor' },
    
    // Sección 9: Vulnerabilidades en los Controles Internos
    { id: 'p9_1', nombre: 'P9.1 - Diseño' },
    { id: 'p9_1_numerico', nombre: 'P9.1 - Valor' },
    { id: 'p9_2', nombre: 'P9.2 - Implementación' },
    { id: 'p9_2_numerico', nombre: 'P9.2 - Valor' },
    { id: 'p9_3', nombre: 'P9.3 - Efectividad' },
    { id: 'p9_3_numerico', nombre: 'P9.3 - Valor' },
    
    
    { id: 'promedio_riesgo', nombre: 'Promedio de Riesgo' }
];

export const COLUMNAS_NUMERICAS_LDFT = COLUMNAS_REPORTE_LDFT.filter(col => col.id.endsWith('_numerico'));