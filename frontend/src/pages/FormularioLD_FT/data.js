export const secciones = [

        {
            titulo: "1. Administración del Riesgo de LGI/FT-FPADM",
            preguntas: [
                {
                    id: "p1_1",
                    texto: "1.1. ¿Existe un área independiente responsable de administrar el riesgo de LGI/FT-FPADM?",
                    opciones: [
                        { value: 'Área especializada con recursos dedicados y autonomía', label: 'Área especializada con recursos dedicados y autonomía',valor:1 },
                        { value: 'Área definida pero con recursos compartidos', label: 'Área definida pero con recursos compartidos',valor:2 },
                        { value: 'Responsabilidad asignada a una persona sin equipo', label: 'Responsabilidad asignada a una persona sin equipo',valor:3 },
                        { value: 'Funciones dispersas sin responsable claro', label: 'Funciones dispersas sin responsable claro', valor:4 },
                        { value: 'No existe estructura para gestionar el riesgo', label: 'No existe estructura para gestionar el riesgo',valor:5 }
                    ]
                },
                {
                    id: "p1_2",
                    texto: "1.2. ¿Cómo se implementa la gestión de riesgos de LGI/FT-FPADM?",
                    opciones: [
                        { value: 'Sistema integral con identificación, medición y monitoreo continuo', label: 'Sistema integral con identificación, medición y monitoreo continuo',valor:1 },
                        { value: 'Procesos establecidos pero con algunas limitaciones', label: 'Procesos establecidos pero con algunas limitaciones', valor:2 },
                        { value: 'Algunos elementos implementados de forma aislada', label: 'Algunos elementos implementados de forma aislada', valor:3 },
                        { value: 'Solo acciones reactivas ante requerimientos', label: 'Solo acciones reactivas ante requerimientos', valor:4 },
                        { value: 'No existe gestión formal de riesgos', label: 'No existe gestión formal de riesgos', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "2. Involucramiento de la Administración",
            preguntas: [
                {
                    id: "p2_1",
                    texto: "2.1. ¿Existen políticas y procedimientos para prevenir LGI/FT-FPADM?",
                    opciones: [
                        { value: 'Políticas completas, actualizadas y alineadas con regulaciones', label: 'Políticas completas, actualizadas y alineadas con regulaciones', valor:1 },
                        { value: 'Políticas documentadas pero con actualizaciones irregulares', label: 'Políticas documentadas pero con actualizaciones irregulares', valor:2 },
                        { value: 'Documentación básica sin especificidad', label: 'Documentación básica sin especificidad', valor:3 },
                        { value: 'Políticas mínimas solo por cumplimiento', label: 'Políticas mínimas solo por cumplimiento',valor:4 },
                        { value: 'No existen políticas documentadas', label: 'No existen políticas documentadas', valor:5 }
                    ]
                },
                {
                    id: "p2_2",
                    texto: "2.2. ¿Cómo es el apoyo al Oficial de Cumplimiento?",
                    opciones: [
                        { value: 'Apoyo total con autonomía y recursos adecuados', label: 'Apoyo total con autonomía y recursos adecuados', valor:1 },
                        { value: 'Apoyo suficiente pero con algunas limitaciones', label: 'Apoyo suficiente pero con algunas limitaciones', valor:2 },
                        { value: 'Apoyo básico solo para funciones esenciales', label: 'Apoyo básico solo para funciones esenciales', valor:3 },
                        { value: 'Apoyo mínimo sin influencia real', label: 'Apoyo mínimo sin influencia real', valor:4 },
                        { value: 'No existe Oficial de Cumplimiento', label: 'No existe Oficial de Cumplimiento', valor:5 }
                    ]
                },
                {
                    id: "p2_3",
                    texto: "2.3. ¿Cómo se gestiona la información de empleados?",
                    opciones: [
                        { value: 'Registro completo con verificaciones y actualizaciones periódicas', label: 'Registro completo con verificaciones y actualizaciones periódicas', valor:1 },
                        { value: 'Información básica con algunas actualizaciones', label: 'Información básica con algunas actualizaciones', valor:2 },
                        { value: 'Datos iniciales sin revisiones sistemáticas', label: 'Datos iniciales sin revisiones sistemáticas', valor:3 },
                        { value: 'Información mínima sin validación', label: 'Información mínima sin validación', valor:4 },
                        { value: 'No se mantiene registro formal', label: 'No se mantiene registro formal', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "3. Política 'Conozca a su Cliente'",
            preguntas: [
                {
                    id: "p3_1",
                    texto: "3.1. ¿Cómo se identifica y conoce a los clientes?",
                    opciones: [
                        { value: 'Verificación exhaustiva con múltiples fuentes confiables', label: 'Verificación exhaustiva con múltiples fuentes confiables',valor:1 },
                        { value: 'Validación con documentos oficiales básicos', label: 'Validación con documentos oficiales básicos', valor:2 },
                        { value: 'Información proporcionada por el cliente sin verificación', label: 'Información proporcionada por el cliente sin verificación', valor:3 },
                        { value: 'Solo datos mínimos requeridos por ley', label: 'Solo datos mínimos requeridos por ley', valor:4 },
                        { value: 'No se realiza identificación formal', label: 'No se realiza identificación formal', valor:5 }
                    ]
                },
                {
                    id: "p3_2",
                    texto: "3.2. ¿Cómo se registran clientes y transacciones?",
                    opciones: [
                        { value: 'Sistema completo con historial detallado y accesible', label: 'Sistema completo con historial detallado y accesible',valor:1 },
                        { value: 'Registros básicos cumpliendo requisitos mínimos', label: 'Registros básicos cumpliendo requisitos mínimos', valor:2 },
                        { value: 'Algunos datos registrados de forma inconsistente', label: 'Algunos datos registrados de forma inconsistente', valor:3 },
                        { value: 'Registros incompletos o desorganizados', label: 'Registros incompletos o desorganizados', valor:4 },
                        { value: 'No se mantienen registros sistemáticos', label: 'No se mantienen registros sistemáticos', valor:5 }
                    ]
                },
                {
                    id: "p3_3",
                    texto: "3.3. ¿Con qué frecuencia se actualiza información de clientes?",
                    opciones: [
                        { value: 'Actualización periódica programada y ante cambios relevantes', label: 'Actualización periódica programada y ante cambios relevantes',valor:1 },
                        { value: 'Revisiones anuales según requerimientos', label: 'Revisiones anuales según requerimientos', valor:2 },
                        { value: 'Solo cuando el cliente reporta cambios', label: 'Solo cuando el cliente reporta cambios', valor:3 },
                        { value: 'Actualizaciones esporádicas sin sistema', label: 'Actualizaciones esporádicas sin sistema', valor:4 },
                        { value: 'Nunca se actualiza la información', label: 'Nunca se actualiza la información', valor:5 }
                    ]
                }
            ]
        },  
        {
            titulo: "4. Monitoreo de Transacciones",
            preguntas: [
                {
                    id: "p4_1",
                    texto: "4.1. ¿Qué herramientas se usan para monitorear transacciones?",
                    opciones: [
                        { value: 'Sistema automatizado con alertas inteligentes y análisis avanzado', label: 'Sistema automatizado con alertas inteligentes y análisis avanzado', valor:1 },
                        { value: 'Software básico con revisión manual complementaria', label: 'Software básico con revisión manual complementaria', valor:2 },
                        { value: 'Procesos manuales sin soporte tecnológico', label: 'Procesos manuales sin soporte tecnológico', valor:3 },
                        { value: 'Registros mínimos sin capacidad de análisis', label: 'Registros mínimos sin capacidad de análisis', valor:4 },
                        { value: 'No existe monitoreo de transacciones', label: 'No existe monitoreo de transacciones', valor:5 }
                    ]
                },
                {
                    id: "p4_2",
                    texto: "4.2. ¿Cómo se detectan transacciones inusuales/sospechosas?",
                    opciones: [
                        { value: 'Sistema proactivo con indicadores y protocolos claros', label: 'Sistema proactivo con indicadores y protocolos claros', valor:1 },
                        { value: 'Detección básica con algunos criterios establecidos', label: 'Detección básica con algunos criterios establecidos', valor:2 },
                        { value: 'Identificación ocasional dependiendo del personal', label: 'Identificación ocasional dependiendo del personal', valor:3 },
                        { value: 'Solo ante denuncias o requerimientos externos', label: 'Solo ante denuncias o requerimientos externos', valor:4 },
                        { value: 'No se detectan transacciones sospechosas', label: 'No se detectan transacciones sospechosas', valor:5 }
                    ]
                },
                {
                    id: "p4_3",
                    texto: "4.3. ¿Cómo se gestionan transacciones sospechosas detectadas?",
                    opciones: [
                        { value: 'Investigación exhaustiva y reporte oportuno a autoridades', label: 'Investigación exhaustiva y reporte oportuno a autoridades', valor:1 },
                        { value: 'Análisis básico con reportes según requerimientos', label: 'Análisis básico con reportes según requerimientos', valor:2 },
                        { value: 'Registro sin seguimiento sistemático', label: 'Registro sin seguimiento sistemático', valor:3 },
                        { value: 'Acciones mínimas sin documentación', label: 'Acciones mínimas sin documentación', valor:4 },
                        { value: 'No se toman acciones ante sospechas', label: 'No se toman acciones ante sospechas', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "5. Gestión del Oficial de Cumplimiento",
            preguntas: [
                {
                    id: "p5_1",
                    texto: "5.1. ¿Cómo es el perfil y jerarquía del Oficial de Cumplimiento?",
                    opciones: [
                        { value: 'Perfil calificado con acceso directo a máxima dirección', label: 'Perfil calificado con acceso directo a máxima dirección',valor:1 },
                        { value: 'Experiencia adecuada con autonomía operativa', label: 'Experiencia adecuada con autonomía operativa', valor:2 },
                        { value: 'Nivel medio con algunas limitaciones de autoridad', label: 'Nivel medio con algunas limitaciones de autoridad', valor:3 },
                        { value: 'Cargo junior sin influencia real', label: 'Cargo junior sin influencia real', valor:4 },
                        { value: 'No existe la figura designada', label: 'No existe la figura designada', valor:5 }
                    ]
                },
                {
                    id: "p5_2",
                    texto: "5.2. ¿Cómo cumple sus funciones el Oficial de Cumplimiento?",
                    opciones: [
                        { value: 'Ejecución completa de atribuciones con recursos adecuados', label: 'Ejecución completa de atribuciones con recursos adecuados', valor:1 },
                        { value: 'Cumplimiento básico de funciones esenciales', label: 'Cumplimiento básico de funciones esenciales',valor:2 },
                        { value: 'Algunas responsabilidades delegadas o compartidas', label: 'Algunas responsabilidades delegadas o compartidas', valor:3 },
                        { value: 'Rol simbólico sin ejecución efectiva', label: 'Rol simbólico sin ejecución efectiva', valor:4 },
                        { value: 'No aplica (no existe el cargo)', label: 'No aplica (no existe el cargo)', valor:5 }
                    ]
                },
                {
                    id: "p5_3",
                    texto: "5.3. ¿Cómo reporta al Directorio/Administración?",
                    opciones: [
                        { value: 'Reportes periódicos con métricas y planes de acción', label: 'Reportes periódicos con métricas y planes de acción', valor:1 },
                        { value: 'Informes resumidos con frecuencia establecida', label: 'Informes resumidos con frecuencia establecida', valor:2 },
                        { value: 'Comunicaciones esporádicas sin formato definido', label: 'Comunicaciones esporádicas sin formato definido', valor:3 },
                        { value: 'Solo ante requerimientos específicos', label: 'Solo ante requerimientos específicos', valor:4 },
                        { value: 'No existe comunicación formal', label: 'No existe comunicación formal', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "6. Programas de Capacitación",
            preguntas: [
                {
                    id: "p6_1",
                    texto: "6.1. ¿Cómo es el programa de capacitación en LGI/FT-FPADM?",
                    opciones: [
                        { value: 'Capacitación obligatoria anual con evaluaciones y seguimiento', label: 'Capacitación obligatoria anual con evaluaciones y seguimiento', valor:1 },
                        { value: 'Entrenamientos regulares sin sistema de evaluación', label: 'Entrenamientos regulares sin sistema de evaluación', valor:2 },
                        { value: 'Charlas ocasionales sin programación fija', label: 'Charlas ocasionales sin programación fija', valor:3 },
                        { value: 'Material disponible pero sin capacitación formal', label: 'Material disponible pero sin capacitación formal', valor:4 },
                        { value: 'No existe programa de capacitación', label: 'No existe programa de capacitación', valor:5 }
                    ]
                },
                {
                    id: "p6_2",
                    texto: "6.2. ¿Cómo se registran y evalúan las capacitaciones?",
                    opciones: [
                        { value: 'Registro completo con evaluaciones y plan de mejora', label: 'Registro completo con evaluaciones y plan de mejora', valor:1 },
                        { value: 'Listas de asistencia sin evaluación de aprendizaje', label: 'Listas de asistencia sin evaluación de aprendizaje', valor:2 },
                        { value: 'Algunos registros incompletos', label: 'Algunos registros incompletos', valor:3 },
                        { value: 'Registros mínimos sin organización', label: 'Registros mínimos sin organización', valor:4 },
                        { value: 'No se llevan registros', label: 'No se llevan registros', valor:5 }
                    ]
                },
                {
                    id: "p6_3",
                    texto: "6.3. ¿Cómo se identifican necesidades de capacitación?",
                    opciones: [
                        { value: 'Evaluaciones periódicas y análisis de brechas', label: 'Evaluaciones periódicas y análisis de brechas', valor:1 },
                        { value: 'Encuestas ocasionales a empleados', label: 'Encuestas ocasionales a empleados', valor:2 },
                        { value: 'Solo ante cambios regulatorios importantes', label: 'Solo ante cambios regulatorios importantes', valor:3 },
                        { value: 'Sin metodología definida', label: 'Sin metodología definida', valor:4 },
                        { value: 'No se identifican necesidades formalmente', label: 'No se identifican necesidades formalmente', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "7. Programas de Auditoría",
            preguntas: [
                {
                    id: "p7_1",
                    texto: "7.1. ¿Cómo es la auditoría de controles LGI/FT-FPADM?",
                    opciones: [
                        { value: 'Auditorías periódicas exhaustivas con seguimiento de hallazgos', label: 'Auditorías periódicas exhaustivas con seguimiento de hallazgos', valor:1 },
                        { value: 'Revisiones básicas cumpliendo requisitos mínimos', label: 'Revisiones básicas cumpliendo requisitos mínimos', valor:2 },
                        { value: 'Evaluaciones superficiales sin profundidad', label: 'Evaluaciones superficiales sin profundidad', valor:3 },
                        { value: 'Solo ante requerimientos específicos', label: 'Solo ante requerimientos específicos', valor:4 },
                        { value: 'No existe auditoría', label: 'No existe auditoría', valor:5 }
                    ]
                },
                {
                    id: "p7_2",
                    texto: "7.2. ¿Se contrata auditoría especializada?",
                    opciones: [
                        { value: 'Auditoría anual independiente con informes detallados', label: 'Auditoría anual independiente con informes detallados', valor:1 },
                        { value: 'Evaluación externa ocasional por cumplimiento', label: 'Evaluación externa ocasional por cumplimiento', valor:2 },
                        { value: 'Solo revisiones básicas sin especialización', label: 'Solo revisiones básicas sin especialización', valor:3 },
                        { value: 'Únicamente ante requerimientos regulatorios', label: 'Únicamente ante requerimientos regulatorios', valor:4 },
                        { value: 'Nunca se ha contratado auditoría', label: 'Nunca se ha contratado auditoría', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "8. Vulnerabilidades en el Proceso de Debida Diligencia",
            preguntas: [
                {
                    id: "p8_1",
                    texto: "8.1. ¿Con qué frecuencia se actualizan los criterios de evaluación de riesgos de clientes?",
                    opciones: [
                        { value: 'Revisión trimestral con ajustes según cambios regulatorios y de mercado', label: 'Revisión trimestral con ajustes según cambios regulatorios y de mercado', valor:1 },
                        { value: 'Actualización anual basada en auditorías', label: 'Actualización anual basada en auditorías', valor:2 },
                        { value: 'Ocasionalmente cuando se detectan problemas', label: 'Ocasionalmente cuando se detectan problemas', valor:3 },
                        { value: 'No se han actualizado en los últimos 3 años', label: 'No se han actualizado en los últimos 3 años', valor:4 },
                        { value: 'Nunca se han actualizado', label: 'Nunca se han actualizado', valor:5 }
                    ]
                },
                {
                    id: "p8_2",
                    texto: "8.2. ¿Cómo se verifica que la información proporcionada por los clientes sea auténtica?",
                    opciones: [
                        { value: 'Validación con múltiples fuentes confiables y verificaciones cruzadas', label: 'Validación con múltiples fuentes confiables y verificaciones cruzadas', valor:1 },
                        { value: 'Comparación con documentos oficiales y bases de datos básicas', label: 'Comparación con documentos oficiales y bases de datos básicas', valor:2 },
                        { value: 'Revisión superficial de documentos presentados', label: 'Revisión superficial de documentos presentados', valor:3 },
                        { value: 'Se confía en la información proporcionada sin verificación', label: 'Se confía en la información proporcionada sin verificación', valor:4 },
                        { value: 'No se solicita comprobación de información', label: 'No se solicita comprobación de información', valor:5 }
                    ]
                },
                {
                    id: "p8_3",
                    texto: "8.3. ¿Qué ocurre cuando se detectan inconsistencias en la información de un cliente?",
                    opciones: [
                        { value: 'Protocolo de investigación con escalamiento a compliance y posible rechazo', label: 'Protocolo de investigación con escalamiento a compliance y posible rechazo', valor:1 },
                        { value: 'Se solicita aclaración al cliente y documentación adicional', label: 'Se solicita aclaración al cliente y documentación adicional', valor:2 },
                        { value: 'Depende del criterio del analista asignado', label: 'Depende del criterio del analista asignado', valor:3 },
                        { value: 'Se registra pero no afecta la relación comercial', label: 'Se registra pero no afecta la relación comercial', valor:4 },
                        { value: 'No se detectan inconsistencias (no hay revisión)', label: 'No se detectan inconsistencias (no hay revisión)', valor:5 }
                    ]
                }
            ]
        },
        {
            titulo: "9. Vulnerabilidades en los Controles Internos",
            preguntas: [
                {
                    id: "p9_1",
                    texto: "9.1. ¿Cómo se aseguran de que todos los empleados siguen los procedimientos de debida diligencia?",
                    opciones: [
                        { value: 'Sistema de monitoreo continuo con alertas y capacitación obligatoria', label: 'Sistema de monitoreo continuo con alertas y capacitación obligatoria', valor:1 },
                        { value: 'Muestreos aleatorios y revisiones periódicas', label: 'Muestreos aleatorios y revisiones periódicas', valor:2 },
                        { value: 'Supervisión básica sin metodología definida', label: 'Supervisión básica sin metodología definida', valor:3 },
                        { value: 'Se confía en que los empleados siguen los procesos', label: 'Se confía en que los empleados siguen los procesos', valor:4 },
                        { value: 'No hay forma de verificar el cumplimiento', label: 'No hay forma de verificar el cumplimiento', valor:5 }
                    ]
                },
                {
                    id: "p9_2",
                    texto: "9.2. ¿Qué tan rápido pueden detectar y responder a fallas en los controles?",
                    opciones: [
                        { value: 'Detección en tiempo real con protocolos de acción inmediata', label: 'Detección en tiempo real con protocolos de acción inmediata', valor:1 },
                        { value: 'Detección en auditorías trimestrales con planes correctivos', label: 'Detección en auditorías trimestrales con planes correctivos', valor:2 },
                        { value: 'Solo se detectan cuando generan problemas evidentes', label: 'Solo se detectan cuando generan problemas evidentes', valor:3 },
                        { value: 'Generalmente se descubren por denuncias externas', label: 'Generalmente se descubren por denuncias externas', valor:4 },
                        { value: 'No hay capacidad de detección proactiva', label: 'No hay capacidad de detección proactiva', valor:5 }
                    ]
                },
                {
                    id: "p9_3",
                    texto: "9.3. ¿Cómo manejan situaciones donde los procesos normales no aplican (casos excepcionales)?",
                    opciones: [
                        { value: 'Protocolo de excepciones con aprobación multinivel y registro detallado', label: 'Protocolo de excepciones con aprobación multinivel y registro detallado', valor:1 },
                        { value: 'Requieren aprobación gerencial con justificación documentada', label: 'Requieren aprobación gerencial con justificación documentada', valor:2 },
                        { value: 'Se resuelven caso por caso sin estándar claro', label: 'Se resuelven caso por caso sin estándar claro', valor:3 },
                        { value: 'Los supervisores pueden hacer excepciones discrecionales', label: 'Los supervisores pueden hacer excepciones discrecionales', valor:4 },
                        { value: 'No hay control sobre excepciones a procesos', label: 'No hay control sobre excepciones a procesos', valor:5 }
                    ]
                }
            ]
        }
    ];