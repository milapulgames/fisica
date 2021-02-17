let DATOS = {};
const INFO = {};

function inicializar() {
  if (sessionStorage.DATOS) {
    DATOS = JSON.parse(sessionStorage.DATOS);
  } else {
    DATOS.cuerpos = {
      rojo:{
        pos_x: 50,
        pos_y: 50,
        vel_x: 10,
        vel_y: 0,
        acc_x: 0,
        acc_y: 0,
        radio: 10,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5
      },
      verde:{
        pos_x: 150,
        pos_y: 150,
        vel_x: 0,
        vel_y: -5,
        acc_x: 0,
        acc_y: 0,
        radio: 5,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5
      },
      azul:{
        pos_x: 100,
        pos_y: 100,
        vel_x: 0,
        vel_y: 0,
        acc_x: 0,
        acc_y: 0,
        radio: 15,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5
      },
      amarillo:{
        pos_x: 50,
        pos_y: 150,
        vel_x: 5,
        vel_y: -5,
        acc_x: 0,
        acc_y: 0,
        radio: 10,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5
      },
      magenta:{
        pos_x: 150,
        pos_y: 50,
        vel_x: 1,
        vel_y: 1,
        acc_x: 0,
        acc_y: 0,
        radio: 10,
        masa: 10,
        elasticidad: 0.5,
        rozamiento: 0.5
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
  document.getElementById('pos_x').value = datos.pos_x;
  document.getElementById('pos_y').value = datos.pos_y;
  document.getElementById('vel_x').value = datos.vel_x;
  document.getElementById('vel_y').value = datos.vel_y;
  document.getElementById('acc_x').value = datos.acc_x;
  document.getElementById('acc_y').value = datos.acc_y;
  document.getElementById('radio').value = datos.radio;
  document.getElementById('masa').value = datos.masa;
  document.getElementById('elasticidad').value = datos.elasticidad;
  document.getElementById('rozamiento').value = datos.rozamiento;
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
    pos_x: 100,
    pos_y: 100,
    vel_x: 0,
    vel_y: 0,
    acc_x: 0,
    acc_y: 0,
    radio: 10,
    masa: 10,
    elasticidad: 0.5,
    rozamiento: 0.5
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

function cambiaRadio() {
  DATOS.cuerpos[document.getElementById('selectorCuerpos').value].radio = parseInt(document.getElementById('radio').value);
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
};

function ejecutar() {
  document.getElementById('botonEjecutar').disabled = true;
  document.getElementById('divCuerpos').style.display = 'none';
  INFO.cuerpos = duplicar(DATOS.cuerpos);
  INFO.intervalo = setInterval(pulso, 10);
  document.getElementById('botonDetener').disabled = false;
};

function detener() {
  document.getElementById('botonDetener').disabled = true;
  document.getElementById('divCuerpos').style.display = 'block';
  clearInterval(INFO.intervalo);
  document.getElementById('botonEjecutar').disabled = false;
};

function reiniciar() {
  INFO.cuerpos = duplicar(DATOS.cuerpos);
  Canvas.actualizar(INFO.cuerpos);
};

function pulso() {
  Fisica.actualizar(INFO);
  Canvas.actualizar(INFO.cuerpos);
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
