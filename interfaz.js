let DATOS = {};
const INFO = {};
const COLISIONADOR = {
  CIRCULO: "Círculo",
  RECTA: "Recta",
  SEGMENTO: "Segmento"
};

function inicializar() {
  if (sessionStorage.DATOS) {
    DATOS = JSON.parse(sessionStorage.DATOS);
  } else {
    DATOS.cuerpos = {
      rojo:{
        clase: Fisica.DINAMICO,
        pos_x: 50,
        pos_y: 50,
        vel_x: 5,
        vel_y: 0,
        acc_x: 0,
        acc_y: 0,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5,
        colisionador:{
          tipo: COLISIONADOR.CIRCULO,
          radio: 10
        }
      },
      verde:{
        clase: Fisica.DINAMICO,
        pos_x: 150,
        pos_y: 150,
        vel_x: 0,
        vel_y: -5,
        acc_x: 0,
        acc_y: 0,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5,
        colisionador:{
          tipo: COLISIONADOR.CIRCULO,
          radio: 10
        }
      },
      azul:{
        clase: Fisica.DINAMICO,
        pos_x: 100,
        pos_y: 100,
        vel_x: 0,
        vel_y: 0,
        acc_x: 0,
        acc_y: 0,
        masa: 20,
        elasticidad: 0.5,
        rozamiento: 0.5,
        colisionador:{
          tipo: COLISIONADOR.CIRCULO,
          radio: 15
        }
      },
      amarillo:{
        clase: Fisica.DINAMICO,
        pos_x: 50,
        pos_y: 150,
        vel_x: 1,
        vel_y: -1,
        acc_x: 0,
        acc_y: 0,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5,
        colisionador:{
          tipo: COLISIONADOR.CIRCULO,
          radio: 5
        }
      },
      magenta:{
        clase: Fisica.DINAMICO,
        pos_x: 150,
        pos_y: 250,
        vel_x: 0.5,
        vel_y: 0.5,
        acc_x: 0,
        acc_y: 0,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5,
        colisionador:{
          tipo: COLISIONADOR.CIRCULO,
          radio: 10
        }
      },
      pared:{
        clase: Fisica.ESTATICO,
        pos_x: 200,
        pos_y: 10,
        vel_x: 0,
        vel_y: 0,
        acc_x: 0,
        acc_y: 0,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5,
        colisionador:{
          tipo: COLISIONADOR.RECTA,
          pendiente: 1
        }
      }
    };
    DATOS.otros = {
      rozamientoSuelo: 0.0,
      paredes: false,
      gravedadEntorno: 0.0,
      gravedadCuerpos: false,
      viento_x: 0,
      viento_y: 0
    };
  }
  actualizarSelectorCuerpos();
  actualizarOpcionesCuerpos();
  actualizarOtrasOpciones();
  Canvas.inicializar();
  CLOCK.crear(100,50);
  SLIDER.nuevo({
    placeholderId: 'sliderPlaceholder',
    mostrarValor: false,
    paso: 10,
    funcion: cambiarVelocidad
  });
  reiniciar();
};

function cambiarVelocidad(valor) {
  CLOCK.setearVelocidad(Math.floor(valor));
};

function actualizarSelectorCuerpos() {
  opciones = '';
  for (opcion in DATOS.cuerpos) {
    opciones += `<option>${opcion}</option>`
  }
  document.getElementById('selectorCuerpos').innerHTML = opciones;
};

function actualizarOpcionesCuerpos() {
  datos = DATOS.cuerpos[document.getElementById('selectorCuerpos').value];
  document.getElementById('selectorClase').value = datos.clase;
  document.getElementById('pos_x').value = datos.pos_x;
  document.getElementById('pos_y').value = datos.pos_y;
  document.getElementById('vel_x').value = datos.vel_x;
  document.getElementById('vel_y').value = datos.vel_y;
  document.getElementById('acc_x').value = datos.acc_x;
  document.getElementById('acc_y').value = datos.acc_y;
  document.getElementById('masa').value = datos.masa;
  document.getElementById('elasticidad').value = datos.elasticidad;
  document.getElementById('rozamiento').value = datos.rozamiento;
  let tipoColisionador = datos.colisionador.tipo;
  document.getElementById('selectorColisionador').value = tipoColisionador;
  switch (tipoColisionador) {
    case COLISIONADOR.CIRCULO:
      document.getElementById('opcionesCírculo').style.display = 'block';
      document.getElementById('opcionesRecta').style.display = 'none';
      document.getElementById('opcionesSegmento').style.display = 'none';
      document.getElementById('radio').value = datos.colisionador.radio;
      break;
    case COLISIONADOR.RECTA:
      document.getElementById('opcionesCírculo').style.display = 'none';
      document.getElementById('opcionesRecta').style.display = 'block';
      document.getElementById('opcionesSegmento').style.display = 'none';
      let pendiente = datos.colisionador.pendiente;
      let vertical = pendiente === undefined;
      document.getElementById('pendienteVertical').checked = vertical;
      document.getElementById('pendiente').style.display = (vertical ? 'none' : 'block');
      document.getElementById('pendiente').value = (vertical ? 0 : pendiente);
      break;
    case COLISIONADOR.SEGMENTO:
      document.getElementById('opcionesCírculo').style.display = 'none';
      document.getElementById('opcionesRecta').style.display = 'none';
      document.getElementById('opcionesSegmento').style.display = 'block';
      document.getElementById('hasta_x').value = datos.colisionador.hasta.x;
      document.getElementById('hasta_y').value = datos.colisionador.hasta.y;
      break;
    default:
      //
  }
};

function actualizarOtrasOpciones() {
  datos = DATOS.otros;
  document.getElementById('rozamientoSuelo').value = datos.rozamientoSuelo;
  document.getElementById('paredes').checked = datos.paredes;
  document.getElementById('gravedadEntorno').value = datos.gravedadEntorno;
  document.getElementById('gravedadCuerpos').checked = datos.gravedadCuerpos;
  document.getElementById('viento_x').value = datos.viento_x;
  document.getElementById('viento_y').value = datos.viento_y;
};

function nuevoCuerpo() {
  let nuevo = prompt("Nombre:");
  DATOS.cuerpos[nuevo] = {
    clase: Fisica.DINAMICO,
    pos_x: 100,
    pos_y: 100,
    vel_x: 0,
    vel_y: 0,
    acc_x: 0,
    acc_y: 0,
    masa: 10,
    elasticidad: 0.5,
    rozamiento: 0.5,
    colisionador:{
      tipo: COLISIONADOR.CIRCULO,
      radio: 10
    }
  };
  actualizarSelectorCuerpos();
  document.getElementById('selectorCuerpos').value = nuevo;
  actualizarOpcionesCuerpos();
  guardarDatos();
};

function borrarCuerpo() {
  if (Object.keys(DATOS.cuerpos).length > 1) {
    let viejo = document.getElementById('selectorCuerpos').value;
    delete DATOS.cuerpos[viejo];
    actualizarSelectorCuerpos();
    actualizarOpcionesCuerpos();
    guardarDatos();
  }
};

function cambiaClase() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].clase = document.getElementById('selectorClase').value;
  guardarDatos();
};

function cambiaPosX() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].pos_x = parseInt(document.getElementById('pos_x').value);
  guardarDatos();
};

function cambiaPosY() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].pos_y = parseInt(document.getElementById('pos_y').value);
  guardarDatos();
};

function cambiaVelX() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].vel_x = parseInt(document.getElementById('vel_x').value);
  guardarDatos();
};

function cambiaVelY() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].vel_y = parseInt(document.getElementById('vel_y').value);
  guardarDatos();
};

function cambiaAccX() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].acc_x = parseInt(document.getElementById('acc_x').value);
  guardarDatos();
};

function cambiaAccY() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].acc_y = parseInt(document.getElementById('acc_y').value);
  guardarDatos();
};

function cambiaElasticidad() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].elasticidad = parseFloat(document.getElementById('elasticidad').value);
  guardarDatos();
};

function cambiaMasa() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].masa = parseInt(document.getElementById('masa').value);
  guardarDatos();
};

function cambiaRozamiento() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].rozamiento = parseFloat(document.getElementById('rozamiento').value);
  guardarDatos();
};

function cambiaColisionador() {
  let nuevoColisionador = {
    tipo: document.getElementById('selectorColisionador').value,
  };
  switch (nuevoColisionador.tipo) {
    case COLISIONADOR.CIRCULO:
      nuevoColisionador.radio = 10;
      break;
    case COLISIONADOR.RECTA:
      nuevoColisionador.pendiente = 1;
      break;
    case COLISIONADOR.SEGMENTO:
      nuevoColisionador.hasta = {x:50,y:50};
      break;
    default:
      //
  }
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].colisionador = nuevoColisionador;
  actualizarOpcionesCuerpos();
  guardarDatos();
};

function cambiaRadio() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].colisionador.radio = parseInt(document.getElementById('radio').value);
  guardarDatos();
};

function cambiaPendiente() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].colisionador.pendiente = parseInt(document.getElementById('pendiente').value);
  guardarDatos();
};

function cambiaPendienteVertical() {
  let vertical = document.getElementById('pendienteVertical').checked;
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].colisionador.pendiente =
    (vertical ? undefined : parseInt(document.getElementById('pendiente').value) || 0);
  actualizarOpcionesCuerpos();
  guardarDatos();
};

function cambiaHastaX() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].colisionador.hasta.x = parseInt(document.getElementById('hasta_x').value);
  guardarDatos();
};

function cambiaHastaY() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].colisionador.hasta.y = parseInt(document.getElementById('hasta_y').value);
  guardarDatos();
};

function cambiaRozamientoSuelo() {
  DATOS.otros.rozamientoSuelo = parseFloat(document.getElementById('rozamientoSuelo').value);
  guardarDatos();
};

function cambiaParedes() {
  DATOS.otros.paredes = document.getElementById('paredes').checked;
  guardarDatos();
};

function cambiaGravedadCuerpos() {
  DATOS.otros.gravedadCuerpos = document.getElementById('gravedadCuerpos').checked;
  guardarDatos();
};

function cambiaGravedadEntorno() {
  DATOS.otros.gravedadEntorno = parseFloat(document.getElementById('gravedadEntorno').value);
  guardarDatos();
};

function cambiaVientoX() {
  DATOS.otros.viento_x = parseInt(document.getElementById('viento_x').value);
  guardarDatos();
};

function cambiaVientoY() {
  DATOS.otros.viento_y = parseInt(document.getElementById('viento_y').value);
  guardarDatos();
};

function guardarDatos() {
  Canvas.actualizar(DATOS.cuerpos);
  sessionStorage.DATOS = JSON.stringify(DATOS);
  reiniciar();
};

function ejecutarDetener() {
  let boton = document.getElementById('botonEjecutarDetener');
  if (boton.innerHTML == 'Ejecutar') {
    ejecutar();
    boton.innerHTML = 'Detener';
  } else {
    detener();
    boton.innerHTML = 'Ejecutar';
  }
};

function ejecutar() {
  document.getElementById('divCuerpos').style.display = 'none';
  CLOCK.iniciar(pulso);
};

function detener() {
  document.getElementById('divCuerpos').style.display = 'block';
  CLOCK.detener();
};

function reiniciar() {
  INFO.cuerpos = duplicar(DATOS.cuerpos);
  Canvas.actualizar(INFO.cuerpos);
};

function pulso() {
  INFO.debugs = [];
  Fisica.actualizar(INFO);
  Canvas.actualizar(INFO.cuerpos);
  for (f of INFO.debugs) {
    f();
  }
};

function debug(f) {
  INFO.debugs.push(f);
};

function duplicar(algo) {
  if (Array.isArray(algo)) {
    let nuevo = [];
    for (e of algo) {
      nuevo.push(duplicar(e));
    }
    return nuevo;
  } else if (typeof(algo) == 'object') {
    let nuevo = {};
    for (k in algo) {
      nuevo[k] = duplicar(algo[k]);
    }
    return nuevo;
  }
  return algo;
};

window.addEventListener('load', inicializar);
