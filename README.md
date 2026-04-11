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


# ADR 002: Selección Estructura Interna del Repositorio

## 📌 Título
**Definición de la estructura interna del repositorio mediante Arquitectura Hexagonal y Domain-Driven Design (DDD) para el sistema BidFlow**

## 📊 Estado
Aceptada

## 📅 Fecha
2026-04-10

---

## 🧩 Contexto

El sistema **BidFlow** debe gestionar procesos de licitación complejos que involucran múltiples áreas del negocio, así como un alto volumen de datos y reglas específicas.

Es fundamental evitar la “amnesia organizacional” y garantizar que la lógica de negocio permanezca estable frente a cambios tecnológicos, como:

- Migración entre bases de datos (SQL / NoSQL)  
- Cambios en APIs externas  

Para lograrlo, se requiere una estructura interna del repositorio que:

- Aísle el núcleo del negocio  
- Permita evolución independiente de las capas externas  
- Facilite la mantenibilidad y escalabilidad  

---

## ⚙️ Decisión

Se adopta la **Arquitectura Hexagonal (Puertos y Adaptadores)** junto con patrones tácticos de **Domain-Driven Design (DDD)** para organizar el código dentro de cada microservicio.

### 🧱 Lineamientos de la estructura

- El **modelo de dominio** será el núcleo del sistema  
  - Sin dependencias de frameworks, librerías externas o infraestructura  

- Se implementará el patrón de **Puertos y Adaptadores**, donde:
  - **Puertos**: Interfaces o contratos de entrada y salida  
  - **Adaptadores**: Traductores hacia bases de datos, APIs externas y UI  

- Se aplicará el principio de **Inversión de Dependencias (DIP)**  

- Se utilizarán patrones tácticos de DDD:
  - Entidades  
  - Objetos de Valor  
  - Agregados  

- Los **Repositorios**:
  - Serán interfaces dentro del dominio  
  - Actuarán como punto único de acceso a la persistencia  

---

## ❌ Alternativas descartadas

### Arquitectura de 3 Capas Tradicional
Se descartó debido a:

- Alto acoplamiento entre lógica de negocio y persistencia  
- Dificultad para evolución tecnológica  
- Problemas de mantenimiento a largo plazo  

### Desarrollo sin estructura definida
Se descartó para evitar:

- Desorganización del código  
- Problemas de escalabilidad  
- Dificultad de entendimiento para nuevos integrantes  

---

## 📈 Consecuencias

### ✅ Positivas

- Independencia tecnológica  
- Mejora en mantenibilidad  
- Facilidad para pruebas unitarias del dominio  
- Escalabilidad del sistema  
- Mejor onboarding de nuevos desarrolladores  

### ⚠️ Negativas

- Mayor complejidad inicial  
- Curva de aprendizaje en:
  - Arquitectura Hexagonal  
  - Domain-Driven Design (DDD)  

---

## 📏 Conformidad

El sistema debe cumplir con:

- El dominio **no depende de frameworks externos**  
- Todas las interacciones con infraestructura se realizan mediante **puertos y adaptadores**  
- Los repositorios se definen como **interfaces dentro del dominio**  
- Separación clara entre:
  - Dominio  
  - Aplicación  
  - Infraestructura  
- Uso de **lenguaje ubicuo** alineado con el negocio  
  - Ej: *Licitación, SME, Pliegos*  

---

## 📝 Notas

- **Autor:** Equipo BidFlow  
- **Versión:** 0.1  

### 📌 Registro de cambios

- 0.1 – Versión inicial  
