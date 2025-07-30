import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const paises = [
    { 'nivel-riesgo': "3", nombre: "Bolivia" },
    { 'nivel-riesgo': "5", nombre: "Afganistán" },
    { 'nivel-riesgo': "1", nombre: "Alemania" },
    { 'nivel-riesgo': "1", nombre: "Andorra" },
    { 'nivel-riesgo': "3", nombre: "Angola" },
    { 'nivel-riesgo': "2", nombre: "Antigua y Barbuda" },
    { 'nivel-riesgo': "4", nombre: "Arabia Saudita" },
    { 'nivel-riesgo': "4", nombre: "Argelia" },
    { 'nivel-riesgo': "2", nombre: "Argentina" },
    { 'nivel-riesgo': "3", nombre: "Armenia" },
    { 'nivel-riesgo': "1", nombre: "Australia" },
    { 'nivel-riesgo': "1", nombre: "Austria" },
    { 'nivel-riesgo': "3", nombre: "Azerbaiyán" },
    { 'nivel-riesgo': "2", nombre: "Bahamas" },
    { 'nivel-riesgo': "3", nombre: "Bangladés" },
    { 'nivel-riesgo': "2", nombre: "Barbados" },
    { 'nivel-riesgo': "3", nombre: "Baréin" },
    { 'nivel-riesgo': "1", nombre: "Bélgica" },
    { 'nivel-riesgo': "2", nombre: "Belice" },
    { 'nivel-riesgo': "3", nombre: "Benín" },
    { 'nivel-riesgo': "3", nombre: "Bielorrusia" },
    { 'nivel-riesgo': "3", nombre: "Bosnia y Herzegovina" },
    { 'nivel-riesgo': "3", nombre: "Botsuana" },
    { 'nivel-riesgo': "2", nombre: "Brasil" },
    { 'nivel-riesgo': "3", nombre: "Brunéi" },
    { 'nivel-riesgo': "2", nombre: "Bulgaria" },
    { 'nivel-riesgo': "3", nombre: "Burkina Faso" },
    { 'nivel-riesgo': "4", nombre: "Burundi" },
    { 'nivel-riesgo': "3", nombre: "Bután" },
    { 'nivel-riesgo': "2", nombre: "Cabo Verde" },
    { 'nivel-riesgo': "3", nombre: "Camboya" },
    { 'nivel-riesgo': "4", nombre: "Camerún" },
    { 'nivel-riesgo': "1", nombre: "Canadá" },
    { 'nivel-riesgo': "3", nombre: "Catar" },
    { 'nivel-riesgo': "4", nombre: "Chad" },
    { 'nivel-riesgo': "2", nombre: "Chile" },
    { 'nivel-riesgo': "2", nombre: "China" },
    { 'nivel-riesgo': "1", nombre: "Chipre" },
    { 'nivel-riesgo': "1", nombre: "Ciudad del Vaticano (Santa Sede)" },
    { 'nivel-riesgo': "3", nombre: "Colombia" },
    { 'nivel-riesgo': "4", nombre: "Comoras" },
    { 'nivel-riesgo': "5", nombre: "Corea del Norte" },
    { 'nivel-riesgo': "2", nombre: "Corea del Sur" },
    { 'nivel-riesgo': "4", nombre: "Costa de Marfil" },
    { 'nivel-riesgo': "2", nombre: "Costa Rica" },
    { 'nivel-riesgo': "2", nombre: "Croacia" },
    { 'nivel-riesgo': "4", nombre: "Cuba" },
    { 'nivel-riesgo': "1", nombre: "Dinamarca" },
    { 'nivel-riesgo': "2", nombre: "Dominica" },
    { 'nivel-riesgo': "3", nombre: "Ecuador" },
    { 'nivel-riesgo': "4", nombre: "Egipto" },
    { 'nivel-riesgo': "3", nombre: "El Salvador" },
    { 'nivel-riesgo': "3", nombre: "Emiratos Árabes Unidos" },
    { 'nivel-riesgo': "5", nombre: "Eritrea" },
    { 'nivel-riesgo': "1", nombre: "Eslovaquia" },
    { 'nivel-riesgo': "1", nombre: "Eslovenia" },
    { 'nivel-riesgo': "1", nombre: "España" },
    { 'nivel-riesgo': "1", nombre: "Estados Unidos" },
    { 'nivel-riesgo': "1", nombre: "Estonia" },
    { 'nivel-riesgo': "3", nombre: "Esuatini" },
    { 'nivel-riesgo': "4", nombre: "Etiopía" },
    { 'nivel-riesgo': "3", nombre: "Filipinas" },
    { 'nivel-riesgo': "1", nombre: "Finlandia" },
    { 'nivel-riesgo': "2", nombre: "Fiyi" },
    { 'nivel-riesgo': "1", nombre: "Francia" },
    { 'nivel-riesgo': "3", nombre: "Gabón" },
    { 'nivel-riesgo': "3", nombre: "Gambia" },
    { 'nivel-riesgo': "3", nombre: "Georgia" },
    { 'nivel-riesgo': "3", nombre: "Ghana" },
    { 'nivel-riesgo': "2", nombre: "Granada" },
    { 'nivel-riesgo': "1", nombre: "Grecia" },
    { 'nivel-riesgo': "3", nombre: "Guatemala" },
    { 'nivel-riesgo': "4", nombre: "Guinea" },
    { 'nivel-riesgo': "4", nombre: "Guinea Ecuatorial" },
    { 'nivel-riesgo': "4", nombre: "Guinea-Bisáu" },
    { 'nivel-riesgo': "3", nombre: "Guyana" },
    { 'nivel-riesgo': "4", nombre: "Haití" },
    { 'nivel-riesgo': "3", nombre: "Honduras" },
    { 'nivel-riesgo': "1", nombre: "Hungría" },
    { 'nivel-riesgo': "3", nombre: "India" },
    { 'nivel-riesgo': "3", nombre: "Indonesia" },
    { 'nivel-riesgo': "5", nombre: "Irak" },
    { 'nivel-riesgo': "5", nombre: "Irán" },
    { 'nivel-riesgo': "1", nombre: "Irlanda" },
    { 'nivel-riesgo': "1", nombre: "Islandia" },
    { 'nivel-riesgo': "2", nombre: "Israel" },
    { 'nivel-riesgo': "1", nombre: "Italia" },
    { 'nivel-riesgo': "2", nombre: "Jamaica" },
    { 'nivel-riesgo': "1", nombre: "Japón" },
    { 'nivel-riesgo': "3", nombre: "Jordania" },
    { 'nivel-riesgo': "3", nombre: "Kazajistán" },
    { 'nivel-riesgo': "4", nombre: "Kenia" },
    { 'nivel-riesgo': "3", nombre: "Kirguistán" },
    { 'nivel-riesgo': "2", nombre: "Kiribati" },
    { 'nivel-riesgo': "3", nombre: "Kuwait" },
    { 'nivel-riesgo': "4", nombre: "Laos" },
    { 'nivel-riesgo': "3", nombre: "Lesoto" },
    { 'nivel-riesgo': "1", nombre: "Letonia" },
    { 'nivel-riesgo': "4", nombre: "Líbano" },
    { 'nivel-riesgo': "4", nombre: "Liberia" },
    { 'nivel-riesgo': "5", nombre: "Libia" },
    { 'nivel-riesgo': "1", nombre: "Liechtenstein" },
    { 'nivel-riesgo': "1", nombre: "Lituania" },
    { 'nivel-riesgo': "1", nombre: "Luxemburgo" },
    { 'nivel-riesgo': "3", nombre: "Macedonia del Norte" },
    { 'nivel-riesgo': "4", nombre: "Madagascar" },
    { 'nivel-riesgo': "3", nombre: "Malasia" },
    { 'nivel-riesgo': "4", nombre: "Malaui" },
    { 'nivel-riesgo': "2", nombre: "Maldivas" },
    { 'nivel-riesgo': "4", nombre: "Malí" },
    { 'nivel-riesgo': "1", nombre: "Malta" },
    { 'nivel-riesgo': "4", nombre: "Marruecos" },
    { 'nivel-riesgo': "2", nombre: "Mauricio" },
    { 'nivel-riesgo': "4", nombre: "Mauritania" },
    { 'nivel-riesgo': "3", nombre: "México" },
    { 'nivel-riesgo': "2", nombre: "Micronesia" },
    { 'nivel-riesgo': "3", nombre: "Moldavia" },
    { 'nivel-riesgo': "1", nombre: "Mónaco" },
    { 'nivel-riesgo': "3", nombre: "Mongolia" },
    { 'nivel-riesgo': "3", nombre: "Montenegro" },
    { 'nivel-riesgo': "4", nombre: "Mozambique" },
    { 'nivel-riesgo': "5", nombre: "Myanmar (Birmania)" },
    { 'nivel-riesgo': "3", nombre: "Namibia" },
    { 'nivel-riesgo': "2", nombre: "Nauru" },
    { 'nivel-riesgo': "3", nombre: "Nepal" },
    { 'nivel-riesgo': "3", nombre: "Nicaragua" },
    { 'nivel-riesgo': "4", nombre: "Níger" },
    { 'nivel-riesgo': "4", nombre: "Nigeria" },
    { 'nivel-riesgo': "1", nombre: "Noruega" },
    { 'nivel-riesgo': "1", nombre: "Nueva Zelanda" },
    { 'nivel-riesgo': "3", nombre: "Omán" },
    { 'nivel-riesgo': "1", nombre: "Países Bajos" },
    { 'nivel-riesgo': "4", nombre: "Pakistán" },
    { 'nivel-riesgo': "2", nombre: "Palaos" },
    { 'nivel-riesgo': "3", nombre: "Panamá" },
    { 'nivel-riesgo': "3", nombre: "Papúa Nueva Guinea" },
    { 'nivel-riesgo': "3", nombre: "Paraguay" },
    { 'nivel-riesgo': "3", nombre: "Perú" },
    { 'nivel-riesgo': "1", nombre: "Polonia" },
    { 'nivel-riesgo': "1", nombre: "Portugal" },
    { 'nivel-riesgo': "1", nombre: "Reino Unido" },
    { 'nivel-riesgo': "5", nombre: "República Centroafricana" },
    { 'nivel-riesgo': "1", nombre: "República Checa" },
    { 'nivel-riesgo': "4", nombre: "República del Congo" },
    { 'nivel-riesgo': "5", nombre: "República Democrática del Congo" },
    { 'nivel-riesgo': "3", nombre: "República Dominicana" },
    { 'nivel-riesgo': "4", nombre: "Ruanda" },
    { 'nivel-riesgo': "2", nombre: "Rumania" },
    { 'nivel-riesgo': "4", nombre: "Rusia" },
    { 'nivel-riesgo': "2", nombre: "Samoa" },
    { 'nivel-riesgo': "2", nombre: "San Cristóbal y Nieves" },
    { 'nivel-riesgo': "1", nombre: "San Marino" },
    { 'nivel-riesgo': "2", nombre: "San Vicente y las Granadinas" },
    { 'nivel-riesgo': "2", nombre: "Santa Lucía" },
    { 'nivel-riesgo': "3", nombre: "Santo Tomé y Príncipe" },
    { 'nivel-riesgo': "3", nombre: "Senegal" },
    { 'nivel-riesgo': "3", nombre: "Serbia" },
    { 'nivel-riesgo': "2", nombre: "Seychelles" },
    { 'nivel-riesgo': "4", nombre: "Sierra Leona" },
    { 'nivel-riesgo': "1", nombre: "Singapur" },
    { 'nivel-riesgo': "2", nombre: "Sint Maarten (parte neerlandesa)" },
    { 'nivel-riesgo': "5", nombre: "Siria" },
    { 'nivel-riesgo': "5", nombre: "Somalia" },
    { 'nivel-riesgo': "3", nombre: "Sri Lanka" },
    { 'nivel-riesgo': "3", nombre: "Sudáfrica" },
    { 'nivel-riesgo': "5", nombre: "Sudán" },
    { 'nivel-riesgo': "5", nombre: "Sudán del Sur" },
    { 'nivel-riesgo': "1", nombre: "Suecia" },
    { 'nivel-riesgo': "1", nombre: "Suiza" },
    { 'nivel-riesgo': "3", nombre: "Surinam" },
    { 'nivel-riesgo': "3", nombre: "Tailandia" },
    { 'nivel-riesgo': "4", nombre: "Tanzania" },
    { 'nivel-riesgo': "3", nombre: "Tayikistán" },
    { 'nivel-riesgo': "5", nombre: "Territorios Palestinos" },
    { 'nivel-riesgo': "3", nombre: "Timor Oriental" },
    { 'nivel-riesgo': "3", nombre: "Togo" },
    { 'nivel-riesgo': "2", nombre: "Tonga" },
    { 'nivel-riesgo': "3", nombre: "Trinidad y Tobago" },
    { 'nivel-riesgo': "3", nombre: "Túnez" },
    { 'nivel-riesgo': "3", nombre: "Turkmenistán" },
    { 'nivel-riesgo': "3", nombre: "Turquía" },
    { 'nivel-riesgo': "2", nombre: "Tuvalu" },
    { 'nivel-riesgo': "4", nombre: "Ucrania" },
    { 'nivel-riesgo': "4", nombre: "Uganda" },
    { 'nivel-riesgo': "2", nombre: "Uruguay" },
    { 'nivel-riesgo': "3", nombre: "Uzbekistán" },
    { 'nivel-riesgo': "2", nombre: "Vanuatu" },
    { 'nivel-riesgo': "4", nombre: "Venezuela" },
    { 'nivel-riesgo': "3", nombre: "Vietnam" },
    { 'nivel-riesgo': "5", nombre: "Yemen" },
    { 'nivel-riesgo': "4", nombre: "Yibuti" },
    { 'nivel-riesgo': "4", nombre: "Zambia" },
    { 'nivel-riesgo': "4", nombre: "Zimbabue" }
];

const InPais = ({ label, name, required = false, defaultValue = '' }) => {
    const [paisSeleccionado, setPaisSeleccionado] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setPaisSeleccionado(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setPaisSeleccionado(e.target.value);
    };

    // Obtiene el nivel de riesgo del país seleccionado
    const paisActual = paises.find(p => p.nombre === paisSeleccionado);
    const riesgoPais = paisActual ? paisActual['nivel-riesgo'] : null;

    return (
        <div className={styles.paisContainer}>
            <label className={styles.paisLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select
                name={name}
                required={required}
                className={styles.paisSelect}
                value={paisSeleccionado}
                onChange={handleChange}
            >
                <option value="">Seleccione un país</option>
                {paises.map((pais) => (
                    <option key={pais.nombre} value={pais.nombre}>
                        {pais.nombre}
                    </option>
                ))}
            </select>

            {/* Campo oculto para el valor numérico del riesgo */}
            <input
                type="hidden"
                name="nacionalidad_numerico"
                value={riesgoPais || ''}
            />
        </div>
    );
};

export default InPais;