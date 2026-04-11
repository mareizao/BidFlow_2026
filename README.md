# ADR 001: Selección de Estilo Arquitectónico

## 📌 Título
**Selección del estilo arquitectónico para el Sistema de Gestión de Licitaciones “BidFlow”**

## 📊 Estado
Aprobado

## 📅 Fecha
2026-04-08

---

## 🧩 Contexto

El proceso actual de gestión de licitaciones en la organización presenta un alto grado de descentralización, apoyándose principalmente en el uso de correo electrónico para coordinar entre **450 y 700 procesos mensuales**.

Este enfoque genera múltiples problemáticas, incluyendo:

- Desorganización documental  
- Falta de trazabilidad en la asignación de responsabilidades  
- Aparición de cuellos de botella operativos  

Uno de los principales puntos críticos se encuentra en la participación de expertos técnicos (SMEs), quienes representan entre el **40% y el 60% del tiempo total de respuesta** en cada proceso.

Adicionalmente, el sistema debe:

- Soportar carga simultánea de documentos técnicos de gran tamaño  
- Operar bajo restricciones estrictas de tiempo  
- Garantizar seguridad de la información  
- Integrarse con sistemas externos de clientes y herramientas corporativas  

En este contexto, se requiere definir un estilo arquitectónico que permita mejorar la **escalabilidad, fiabilidad e interoperabilidad** del sistema propuesto.

---

## ⚙️ Decisión

Se adopta un estilo arquitectónico basado en **microservicios**, utilizando:

- APIs REST para la comunicación entre componentes  
- Modelo cliente-servidor  

### 🔍 Alternativas evaluadas

#### Monolito tradicional / modular
❌ Descartado debido a que un fallo en un componente no crítico puede comprometer la disponibilidad total del sistema, afectando procesos sensibles como el cierre de licitaciones.

#### Arquitectura Serverless
❌ Descartada como enfoque principal debido a:

- Posibles latencias por *cold start*  
- Complejidad en la orquestación de flujos de trabajo extensos  

---

## 📈 Consecuencias

### ✅ Positivas

- Permite el despliegue independiente de servicios  
- Asegura el aislamiento de fallos  
- Mejora la mantenibilidad mediante servicios especializados  
- Facilita la escalabilidad independiente de módulos  
- Fortalece la seguridad con auditoría y trazabilidad por servicio  

### ⚠️ Negativas

- Incrementa la complejidad operativa  
- Introduce latencias de red  
- Requiere mayor esfuerzo en monitoreo y observabilidad  

---

## 📏 Conformidad

Todos los servicios deben cumplir con:

- Exponer interfaces mediante **APIs REST estandarizadas**  
- Implementar autenticación y autorización centralizada (ej: tokens)  
- Ser desplegables de forma independiente  
- Contar con monitoreo, logging y trazabilidad distribuidos  
- Seguir principios de **bajo acoplamiento** y **alta cohesión**  

---

## 📝 Notas

- **Autor:** Juan Esteban Acevedo Patiño  
- **Versión:** 1.0  

### 📌 Registro de cambios

- **1.0** – Versión inicial del ADR adaptada a la plantilla tipo AWS  
