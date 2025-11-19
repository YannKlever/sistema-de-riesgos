document.addEventListener('DOMContentLoaded', function() {
    const productKeyInput = document.getElementById('productKey');
    const activateBtn = document.getElementById('activateBtn');
    const messageDiv = document.getElementById('message');
    const contactLink = document.getElementById('contactLink');

    // Verificar estado actual al cargar
    checkCurrentStatus();

    activateBtn.addEventListener('click', handleActivation);
    contactLink.addEventListener('click', handleContact);

    productKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleActivation();
        }
    });

    async function checkCurrentStatus() {
        try {
            const status = await window.activationAPI.checkActivationStatus();
            if (status) {
                showMessage('El producto ya está activado', 'success');
                activateBtn.disabled = true;
                activateBtn.textContent = 'Activado ✓';
                
                // Cerrar automáticamente después de un tiempo
                setTimeout(() => {
                    window.activationAPI.notifyActivationSuccess();
                }, 1500);
            }
        } catch (error) {
            console.log('Verificación de estado:', error.message);
        }
    }

    async function handleActivation() {
        const productKey = productKeyInput.value.trim();
        
        if (!productKey) {
            showMessage('Por favor ingrese una clave de producto', 'error');
            productKeyInput.focus();
            return;
        }

        // Validar formato básico
        if (!isValidKeyFormat(productKey)) {
            showMessage('Formato de clave inválido', 'error');
            productKeyInput.focus();
            return;
        }

        setLoadingState(true);
        showMessage('Validando clave, por favor espere...', 'info');

        try {
            const result = await window.activationAPI.validateProductKey(productKey);
            
            if (result.success) {
                showMessage('¡Producto activado correctamente!', 'success');
                setSuccessState();
                
                // Notificar éxito y cerrar después de un delay
                setTimeout(() => {
                    window.activationAPI.notifyActivationSuccess();
                }, 2000);
            } else {
                showMessage(result.error || 'Error en la activación', 'error');
                setLoadingState(false);
                productKeyInput.focus();
                productKeyInput.select();
            }
        } catch (error) {
            showMessage('Error durante la activación: ' + error.message, 'error');
            setLoadingState(false);
        }
    }

    function handleContact(e) {
        e.preventDefault();
        showMessage('Contacte a +59162441253', 'info');
    }

    function setLoadingState(loading) {
        activateBtn.disabled = loading;
        activateBtn.textContent = loading ? 'Validando...' : 'Activar Producto';
        productKeyInput.disabled = loading;
    }

    function setSuccessState() {
        activateBtn.disabled = true;
        activateBtn.textContent = 'Activado ✓';
        activateBtn.classList.add('success');
        productKeyInput.disabled = true;
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-ocultar mensajes informativos después de 5 segundos
        if (type === 'info') {
            setTimeout(() => {
                if (messageDiv.textContent === message) {
                    messageDiv.style.display = 'none';
                }
            }, 5000);
        }
    }

    function isValidKeyFormat(key) {
        // Validar formato básico (ejemplo: RISK-ABC123-XYZ789)
        const keyRegex = /^[A-Z0-9]{3,}-[A-Z0-9]{3,}-[A-Z0-9]{3,}$/;
        return keyRegex.test(key);
    }

    // Limpiar listeners al descargar la página
    window.addEventListener('beforeunload', () => {
        window.activationAPI.removeAllListeners('activation-success');
        window.activationAPI.removeAllListeners('activation-error');
    });
});