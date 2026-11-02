const menu = document.querySelector('#menu') // guardo el menu en una variable. querySelector busca en la pagina, 
// el # es para buscar por id. const = no se va a reemplazar

const revisarMenu = () => { // una funcion flecha: un bloque de codigo con nombre que puedo usar muchas veces, los parentesis vacios porque no recibe nada
  menu.classList.toggle('menu-abajo', window.scrollY > 40) // toggle es "pon o quita": si baje mas de 40 pixeles le PONE menu-abajo, si no se la QUITA
} // cierro revisarMenu
window.addEventListener('scroll', revisarMenu) // addEventListener es "estar pendiente de": cada vez que bajo o subo ('scroll'), llama a revisarMenu
revisarMenu() // la llamo una vez al cargar, por si la pagina abre a mitad de camino

const enlacesMenu = document.querySelectorAll('#enlaces .nav-link') // querySelectorAll (con All) trae TODOS, aqui todos los enlaces del menu
const cajaEnlaces = document.querySelector('#enlaces') // la caja que se abre con la hamburguesa

enlacesMenu.forEach((enlace) => { // forEach es "para cada uno": recorre los enlaces uno por uno y le dice enlace, como un apodo
  enlace.addEventListener('click', () => { // cuando le dan clic a ese enlace...
    if (cajaEnlaces.classList.contains('show')) { // ...si la caja tiene "show" (boots se la pone cuando el menu esta abierto)...
      bootstrap.Collapse.getOrCreateInstance(cajaEnlaces).hide() // ...le pido a boots el control de esa caja y la cierro con hide(). 
      // asi en celular se cierra solo
    } // cierro el if
  }) // cierro el clic
}) // cierro el forEach

const secciones = document.querySelectorAll('main section') // todas las section que estan dentro del main, para marcar en el menu la que estoy viendo

const vigilaSecciones = new IntersectionObserver((entradas) => { // IntersectionObserver es un vigilante: avisa cuando algo entra o 
// sale de la pantalla. entradas = lo que cambio
  entradas.forEach((entrada) => { // reviso cada cosa que cambio
    if (!entrada.isIntersecting) return // isIntersecting = "esta en pantalla". el ! es "NO": si NO esta, return = me salgo y no hago nada
    enlacesMenu.forEach((enlace) => { // recorro los enlaces del menu
      enlace.classList.toggle('active', enlace.getAttribute('href') === `#${entrada.target.id}`) // le pongo "active"
      //  solo al enlace cuyo href es igual al id de la seccion en pantalla. === es "exactamente igual"
    }) // cierro el recorrido de enlaces
  }) // cierro el recorrido de entradas
}, { rootMargin: '-45% 0px -50% 0px' }) // rootMargin achica la zona que vigila a una franjita en la mitad de la pantalla, 
// asi cuenta cuando la seccion pasa por la mitad

secciones.forEach((seccion) => vigilaSecciones.observe(seccion)) // le digo al vigilante que vigile cada seccion

const cajaCurvas = document.querySelector('#curvasHero') // la caja vacia del inicio

const dibujarCurvas = async () => { // async avisa que adentro vamos a esperar algo que se demora (traer un archivo)
  const respuesta = await fetch('img/curvas.svg') // fetch pide el archivo del dibujo, await espera a que llegue
  cajaCurvas.innerHTML = await respuesta.text() // lo convierto a texto y lo meto en la caja. no uso <img> porque asi no puedo animar cada linea
  cajaCurvas.querySelectorAll('path').forEach((linea, i) => { // recorro todas las lineas (path) del dibujo. i es el numero de la linea: 0, 1, 2...
    const largo = linea.getTotalLength() // getTotalLength me dice cuanto mide la linea
    linea.style.setProperty('--largo', largo) // le paso esa medida al css como --largo, para que sepa cuanto esconderla
    linea.style.setProperty('--espera', `${i * 0.12}s`) // y cuanto esperar: 0s, 0.12s, 0.24s... asi se dibujan una detras de otra
  }) // cierro el recorrido de lineas
} // cierro dibujarCurvas

dibujarCurvas() // la llamo para que arranque. acordemonos: una funcion no hace nada hasta que la llamamos

const vigilaRevelar = new IntersectionObserver((entradas) => { // otro vigilante, ahora para los bloques
  entradas.forEach((entrada) => { // reviso cada bloque que cambio
    if (entrada.isIntersecting) { // si el bloque entro en la pantalla...
      entrada.target.classList.add('visible') // ...le pongo "visible" y el css lo hace entrar (desde abajo, la izquierda, la derecha o con zoom)
      vigilaRevelar.unobserve(entrada.target) // y dejo de vigilarlo, ya aparecio y no quiero que se esconda otra vez
    } // cierro el if
  }) // cierro el recorrido
}, { threshold: 0.15 }) // threshold = cuando se ve el 15% del bloque, ahi si cuenta

document.querySelectorAll('.revelar').forEach((bloque) => vigilaRevelar.observe(bloque)) // busco todos los que tienen la clase revelar y los pongo a vigilar

const animarContador = (elemento) => { // esta si recibe algo: el numero que tiene que animar
  const meta = Number(elemento.dataset.meta) // dataset.meta lee el data-meta del html. llega como texto "4" y Number lo vuelve numero 4
  let actual = 0 // empieza en 0. let y no const porque va a ir cambiando
  const intervalo = setInterval(() => { // setInterval repite algo una y otra vez, cada 350 milisegundos (abajo)
    actual += 1 // le sumo 1 (+= es "sumale a lo que ya tiene")
    elemento.textContent = actual // y escribo el numero en la pagina
    if (actual >= meta) clearInterval(intervalo) // si ya llego a la meta, clearInterval lo detiene, si no seguiria para siempre
  }, 350) // cada 350 milisegundos
} // cierro animarContador

const vigilaContadores = new IntersectionObserver((entradas) => { // otro vigilante para los numeros
  entradas.forEach((entrada) => { // reviso cada numero
    if (entrada.isIntersecting) { // si el numero se ve...
      animarContador(entrada.target) // ...lo animo
      vigilaContadores.unobserve(entrada.target) // y solo una vez
    } // cierro el if
  }) // cierro el recorrido
}, { threshold: 0.6 }) // cuando se ve el 60% del numero

document.querySelectorAll('.contador').forEach((contador) => vigilaContadores.observe(contador)) // pongo a vigilar todos los contadores

const hojas = document.querySelectorAll('.hoja-flotante') // todas las hojitas

const moverHojas = () => { // mueve las hojas segun lo que he bajado
  hojas.forEach((hoja) => { // para cada hoja...
    const velocidad = Number(hoja.dataset.velocidad) // leo el data-velocidad del html
    const caja = hoja.parentElement.getBoundingClientRect() // parentElement es la seccion de la hoja, getBoundingClientRect dice donde esta en la pantalla
    hoja.style.setProperty('--mover', `${caja.top * velocidad}px`) // que tan lejos esta la seccion de arriba por la velocidad, y se lo paso al css como --mover
  }) // cierro el recorrido
} // cierro moverHojas

window.addEventListener('scroll', moverHojas, { passive: true }) // cada vez que bajo, muevo las hojas. passive: true = no bloqueo el scroll, va mas fluido
moverHojas() // y una vez al cargar

const PREGUNTAS = [ // una lista (corchetes []) de objetos (llaves {}). cada objeto es una pregunta. para agregar otra copio un objeto y le cambio los textos
  { // pregunta 1
    pregunta: '¿Cuáles son los 3 pilares de la sostenibilidad?', // el texto de la pregunta
    opciones: ['Ambiental, social y económico', 'Agua, aire y tierra', 'Precio, calidad y tiempo'], // las 3 opciones
    correcta: 0, // la posicion de la correcta, OJO se cuenta desde 0: 0 es la primera
    explicacion: 'Un proyecto sostenible equilibra lo ambiental, lo social y lo económico.', // lo que sale despues de responder
  }, // cierro la pregunta 1
  { // pregunta 2
    pregunta: '¿Qué debes hacer antes de usar tus elementos de protección personal (EPP)?', // el texto
    opciones: ['Usarlos solo si el supervisor está presente', 'Revisar que estén en buen estado', 'Prestarlos a un compañero'], // las opciones
    correcta: 1, // la segunda
    explicacion: 'Si un EPP está dañado, no te protege. Revísalo siempre antes de usarlo.', // la explicacion
  }, // cierro la pregunta 2
  { // pregunta 3
    pregunta: '¿En qué caneca van los residuos aprovechables, como el plástico y el cartón?', // el texto
    opciones: ['Blanca', 'Negra', 'Verde'], // las opciones
    correcta: 0, // la primera
    explicacion: 'En Colombia la caneca blanca es para aprovechables, la negra para no aprovechables y la verde para orgánicos.', // la explicacion
  }, // cierro la pregunta 3
] // cierro la lista de preguntas

const PUNTOS_POR_RESPUESTA = 10 // cuantos puntos vale cada respuesta buena. en mayuscula porque es un valor fijo

const quizInicio = document.querySelector('#quizInicio')   // pantalla 1, la portadita
const quizJuego = document.querySelector('#quizJuego')     // pantalla 2, las preguntas
const btnEmpezar = document.querySelector('#btnEmpezar')   // el boton de empezar
const zonaQuiz = document.querySelector('#quiz')           // la caja vacia donde escribo la pregunta
const quizMascota = document.querySelector('#quizMascota') // la imagen de la mascota
const quizPaso = document.querySelector('#quizPaso')       // el texto "Pregunta 1 de 3"
const quizPuntos = document.querySelector('#quizPuntos')   // el numero de puntos
const quizBarra = document.querySelector('#quizBarra')     // la barra de avance

let preguntaActual = 0 // en que pregunta voy, empieza en la 0 (la primera). let porque cambia
let puntos = 0         // los puntos que llevo
const cambiarMascota = (nombre) => { // cambia la imagen de la mascota y la hace saltar
  quizMascota.src = `img/mascota-${nombre}.png` // si nombre es "feliz" queda img/mascota-feliz.png
  quizMascota.classList.remove('saltar') // le quito la clase del brinco...
  void quizMascota.offsetWidth           // ...truquito para que el navegador "se de cuenta" del cambio...
  quizMascota.classList.add('saltar')    // ...y se la vuelvo a poner, asi brinca cada vez
} // cierro cambiarMascota

const moverBarra = (porcentaje) => { // llena la barra hasta el porcentaje que le diga
  quizBarra.style.width = `${porcentaje}%` // le cambio el ancho, ej: 33%
  quizBarra.parentElement.setAttribute('aria-valuenow', Math.round(porcentaje)) // le aviso al lector de pantalla en cuanto va. Math.round redondea, 33.33 queda 33
} // cierro moverBarra

btnEmpezar.addEventListener('click', () => { // cuando le dan clic a "Empezar la prueba"...
  quizInicio.hidden = true  // escondo la portadita
  quizJuego.hidden = false  // muestro las preguntas
  mostrarPregunta()         // y pongo la primera pregunta
}) // cierro el clic de empezar

const mostrarPregunta = () => { // escribe en la pagina la pregunta en la que voy
  const { pregunta, opciones } = PREGUNTAS[preguntaActual] // saco de una vez el texto y las opciones de la pregunta en la que voy (esto se llama desestructurar)
  quizPaso.textContent = `Pregunta ${preguntaActual + 1} de ${PREGUNTAS.length}` // +1 porque para la persona la primera es la 1 y no la 0. length = cuantas hay
  moverBarra((preguntaActual / PREGUNTAS.length) * 100) // la barra en el porcentaje de lo que llevo
  zonaQuiz.innerHTML = `
    <p class="quiz-pregunta">${pregunta}</p>
    ${opciones.map((texto, i) => `<button type="button" class="quiz-opcion" data-indice="${i}">${texto}</button>`).join('')}
  ` // innerHTML mete html en la caja: la pregunta y un boton por opcion. map convierte cada opcion en boton (i su posicion en data-indice) y join('') los une
  zonaQuiz.querySelectorAll('.quiz-opcion').forEach((boton) => { // a cada boton de opcion...
    boton.addEventListener('click', () => revisarRespuesta(boton)) // ...cuando le den clic, llama a revisarRespuesta y le manda cual boton fue
  }) // cierro el recorrido de botones
} // cierro mostrarPregunta

const revisarRespuesta = (botonElegido) => { // revisa si la opcion que eligieron es la correcta
  const { correcta, explicacion } = PREGUNTAS[preguntaActual] // saco cual es la correcta y la explicacion
  const elegida = Number(botonElegido.dataset.indice) // la posicion que eligio, la leo del data-indice
  const acerto = elegida === correcta // true si son iguales (acerto), false si no

  zonaQuiz.querySelectorAll('.quiz-opcion').forEach((boton) => { boton.disabled = true }) // bloqueo todos los botones para que no pueda cambiar la respuesta
  zonaQuiz.querySelector(`[data-indice="${correcta}"]`).classList.add('correcta') // busco el boton correcto y le pongo "correcta", el css lo pinta verde
  moverBarra(((preguntaActual + 1) / PREGUNTAS.length) * 100) // la barra avanza apenas responde

  if (acerto) { // si acerto...
    puntos += PUNTOS_POR_RESPUESTA  // le sumo 10 puntos
    quizPuntos.textContent = puntos // los escribo en la pagina
    cambiarMascota('feliz')         // mascota feliz
  } else { // si no...
    botonElegido.classList.add('incorrecta') // pinto de rojo la que eligio
    cambiarMascota('triste')                 // mascota triste
  } // cierro el if

  const esLaUltima = preguntaActual === PREGUNTAS.length - 1 // ¿es la ultima? si voy en la 2 y hay 3 (3 - 1 = 2), si

  zonaQuiz.insertAdjacentHTML('beforeend', `
    <p class="quiz-explicacion"><strong>${acerto ? 'Correcto.' : 'No es esa.'}</strong> ${explicacion}</p>
    <button type="button" id="btnSiguiente" class="btn btn-uwa">${esLaUltima ? 'Ver mi resultado' : 'Siguiente pregunta'}</button>
  `) // insertAdjacentHTML agrega html sin borrar lo que hay, 'beforeend' = al final. el ? : es un if cortico: si acerto "Correcto." si no "No es esa."

  document.querySelector('#btnSiguiente').addEventListener('click', () => { // cuando le dan siguiente...
    preguntaActual += 1 // paso a la siguiente pregunta
    if (esLaUltima) { // si era la ultima...
      mostrarResultado() // ...muestro el resultado
    } else { // si no...
      cambiarMascota('normal') // ...la mascota vuelve a normal
      mostrarPregunta()        // y muestro la siguiente
    } // cierro el if
  }) // cierro el clic de siguiente
} // cierro revisarRespuesta

const mostrarResultado = () => { // el puntaje final
  const total = PREGUNTAS.length * PUNTOS_POR_RESPUESTA // el maximo: 3 preguntas x 10 = 30
  const aprobo = puntos >= total * 0.6 // aprueba si tiene el 60% o mas (18 de 30)
  quizPaso.textContent = 'Resultado' // cambio el texto de arriba
  moverBarra(100) // barra llena
  cambiarMascota(aprobo ? 'feliz' : 'triste') // feliz si aprobo, triste si no
  zonaQuiz.innerHTML = `
    <p class="quiz-pregunta">${aprobo ? '¡Muy bien! Sabes de sostenibilidad.' : 'Te falta repasar un poco.'}</p>
    <p class="quiz-explicacion">Obtuviste <strong>${puntos} de ${total} puntos</strong>. Si quieres capacitar a tu equipo, escríbenos.</p>
    <div class="d-flex flex-wrap gap-2">
      <button type="button" id="btnOtraVez" class="btn btn-uwa">Intentar otra vez</button>
      <a href="#contacto" class="btn btn-linea">Escríbenos</a>
    </div>
  ` // aqui va el = y no el +=, porque quiero REEMPLAZAR la pregunta por el resultado, no sumarle

  document.querySelector('#btnOtraVez').addEventListener('click', () => { // "Intentar otra vez": todo vuelve a cero
    preguntaActual = 0          // a la primera pregunta
    puntos = 0                  // puntos en cero
    quizPuntos.textContent = 0  // y lo escribo en la pagina
    cambiarMascota('normal')    // mascota normal
    mostrarPregunta()           // y arranco otra vez
  }) // cierro el clic de otra vez
} // cierro mostrarResultado

const formContacto = document.querySelector('#formContacto') // el formulario
const btnEnviar = document.querySelector('#btnEnviar')       // el boton de enviar
const respuesta = document.querySelector('#respuesta')       // la caja del mensaje con la mascota

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms)) // espera unos milisegundos. por ahora "hace como si" enviara,
//  cuando pongamos la base de datos aqui va el envio de verdad

const cargando = (activo) => { // pone el boton en modo "Enviando…" con la ruedita, o lo devuelve a normal
  btnEnviar.disabled = activo // si activo es true, bloqueo el boton para que no le den clic dos veces
  btnEnviar.querySelector('.spinner-border').classList.toggle('d-none', !activo) // la ruedita: si esta activo le QUITO el d-none (se ve), 
  // si no se lo pongo. el ! voltea el valor
  btnEnviar.querySelector('.btn-texto').textContent = activo ? 'Enviando…' : 'Enviar mensaje' // cambio el texto del boton
} // cierro cargando

const mostrarRespuesta = (tipo, texto) => { // muestra el mensaje con la mascota feliz (bien) o triste (error)
  respuesta.className = `respuesta${tipo === 'error' ? ' error' : ''}` // si es error queda "respuesta error" (rosado), si no "respuesta" (verde). 
  // al cambiar las clases se quita el d-none y aparece
  respuesta.innerHTML = `<img src="img/mascota-${tipo === 'error' ? 'triste' : 'feliz'}.png" alt=""><span></span>` // la mascota y un span vacio para el texto
  respuesta.querySelector('span').textContent = texto // el texto con textContent y NO innerHTML, por seguridad: si alguien escribe codigo en el nombre, 
  // se muestra como texto y no se ejecuta
} // cierro mostrarRespuesta

formContacto.addEventListener('submit', async (evento) => { // 'submit' es el evento de enviar. evento trae la informacion de lo que paso. 
// async porque adentro esperamos
  evento.preventDefault() // 1. evita lo que hace el formulario normalmente, que es recargar la pagina
  formContacto.classList.add('was-validated') // 2. was-validated es de boots: pinta en rojo los campos mal y en verde los bien

  if (!formContacto.checkValidity()) { // 3. checkValidity revisa si TODOS los campos cumplen (required, el @, el minlength). el ! es "si NO cumple"
    mostrarRespuesta('error', 'Revisa los campos marcados en rojo.') // mascota triste con el mensaje
    return // y me salgo, no sigo
  } // cierro el if

  const datos = Object.fromEntries(new FormData(formContacto)) // 4. FormData saca lo que escribieron y fromEntries lo vuelve un objeto: 
  // { nombre: 'Angie', correo: '...' }

  cargando(true)       // 5. pongo la ruedita
  await esperar(1000)  // espero 1 segundo (aqui va a ir el envio a la base de datos)
  cargando(false)      // quito la ruedita

  mostrarRespuesta('ok', `¡Gracias, ${datos.nombre.split(' ')[0]}! Te escribiremos pronto.`) // 6. gracias con el primer nombre: split(' ') 
  // parte por los espacios y [0] coge el primero
  formContacto.reset() // limpio el formulario
  formContacto.classList.remove('was-validated') // y le quito los colores rojo y verde
}) // cierro el envio

document.querySelector('#anio').textContent = new Date().getFullYear() // new Date() es la fecha de hoy y getFullYear() saca el año, asi en 2027 dice 2027 solito
