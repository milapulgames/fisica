const Fisica = {
  ESTATICO: "Estático",
  DINAMICO: "Dinámico"
};
PAREDES = true;
MASAPAREDES = 10;

Fisica.actualizar = function(datos) {
  for (clave in datos.cuerpos) {
    Fisica.actualizarVelocidadCuerpo(datos.cuerpos, clave, datos.cuerpos[clave]);
    Fisica.actualizarPosicionCuerpo(datos.cuerpos, clave, datos.cuerpos[clave]);
  }
};

Fisica.actualizarVelocidadCuerpo = function(cuerpos, clave, cuerpo) {
  let cuerposYParedes = {}
  let atributosParedes = [
    {x: 0, y: 0, pendiente: 0},
    {x: 0, y: 0, pendiente: undefined},
    {x: Canvas.ancho(), y: Canvas.alto(), pendiente: 0},
    {x: Canvas.ancho(), y: Canvas.alto(), pendiente: undefined}
  ]

  for (let i = 0; i < 4; i++) {
    cuerposYParedes['pared_' + i] = {
      clase: Fisica.ESTATICO,
      pos_x: atributosParedes[i].x,
      pos_y: atributosParedes[i].y,
      vel_x: 0,
      vel_y: 0,
      acc_x: 0,
      acc_y: 0,
      masa: 10,
      elasticidad: 0.5,
      rozamiento: 0.5,
      colisionador:{
        tipo: COLISIONADOR.RECTA,
        pendiente: atributosParedes[i].pendiente
      }
    }
  }
  Object.assign(cuerposYParedes, cuerpos);

  for (otraClave in cuerposYParedes) {
    let otro = cuerposYParedes[otraClave];
    if (clave != otraClave) {
      Fisica.colisiona(cuerpo, otro);
    }
    /*if (clave != otraClave && Fisica.colisiona(cuerpo, otro)) {
      cuerpo.vel_x *= -1;
      cuerpo.vel_y *= -1;
      otro.vel_x *= -1;
      otro.vel_y *= -1;
    }*/
  }
  //Fisica.verificarPared(cuerpo);

};

Fisica.actualizarPosicionCuerpo = function(cuerpos, clave, cuerpo) {
  let proximaPosicion = [
    cuerpo.pos_x + cuerpo.vel_x,
    cuerpo.pos_y + cuerpo.vel_y
  ];
  cuerpo.pos_x = proximaPosicion[0];
  cuerpo.pos_y = proximaPosicion[1];
};

Fisica.colisiona = function(cuerpo, otro) {
  interseccion = Geometria.interseccion(Cuerpo.colisionador2Geometria(cuerpo), Cuerpo.colisionador2Geometria(otro));
  if (interseccion) {
    let recta = interseccion;
    let velocidad = new Victor(cuerpo.vel_x, cuerpo.vel_y);
    debug(function() { Canvas.segmento({x:cuerpo.pos_x, y:cuerpo.pos_y}, {x:cuerpo.pos_x-10*velocidad.x, y:cuerpo.pos_y-10*velocidad.y}, "#00f"); });
    let nuevaVelocidad = Geometria.espejarVector(velocidad, recta);
    debug(function() { Canvas.segmento({x:cuerpo.pos_x, y:cuerpo.pos_y}, {x:cuerpo.pos_x+10*nuevaVelocidad.x, y:cuerpo.pos_y+10*nuevaVelocidad.y}, "#ff0"); });
    cuerpo.vel_x = nuevaVelocidad.x;
    cuerpo.vel_y = nuevaVelocidad.y;
  }
    /*let intensidad = 10;
    if (recta.m) {
      let x = 1;
      let y = recta.m + recta.b;
      let angulo = Math.atan2(y,x);
      angulo += Math.PI;
      Fisica.aplicarFuerza(cuerpo, new Victor(10, 0));
    } else {
      if (cuerpo.pos_x > recta.b) {
        Fisica.aplicarFuerza(cuerpo, new Victor(intensidad, 0));
        Fisica.aplicarFuerza(otro, new Victor(-intensidad, 0));
      } else {
        Fisica.aplicarFuerza(otro, new Victor(intensidad, 0));
        Fisica.aplicarFuerza(cuerpo, new Victor(-intensidad, 0));
      }
    }
    Fisica.aplicarFuerza(cuerpo, recta.rotateByDeg(90));
    Fisica.aplicarFuerza(otro, recta.rotateByDeg(-90));
  }
  let pos1 = new Victor(cuerpo.pos_x, cuerpo.pos_y).add(new Victor(cuerpo.vel_x, cuerpo.vel_y));
  let pos2 = new Victor(otro.pos_x, otro.pos_y).add(new Victor(otro.vel_x, otro.vel_y));
  let distancia = pos1.subtract(pos2).length();
  return (distancia < cuerpo.colisionador.radio + otro.colisionador.radio);*/
};

Fisica.aplicarFuerza = function(cuerpo, recta) {
  cuerpo.vel_x += recta.x;
  cuerpo.vel_y += recta.y;
};

Fisica.verificarPared = function(cuerpo) {
  if (PAREDES) {
    if (cuerpo.pos_x + cuerpo.colisionador.radio >= Canvas.div.width) {
      cuerpo.pos_x = Canvas.div.width - cuerpo.colisionador.radio;
      cuerpo.vel_x *= -1;
    } else if (cuerpo.pos_y + cuerpo.colisionador.radio >= Canvas.div.height) {
      cuerpo.pos_y = Canvas.div.height - cuerpo.colisionador.radio;
      cuerpo.vel_y *= -1;
    } else if (cuerpo.pos_x - cuerpo.colisionador.radio <= 0) {
      cuerpo.pos_x = cuerpo.colisionador.radio;
      cuerpo.vel_x *= -1;
    } else if (cuerpo.pos_y - cuerpo.colisionador.radio <= 0) {
      cuerpo.pos_y = cuerpo.colisionador.radio;
      cuerpo.vel_y *= -1;
    }
  } else {
    if (cuerpo.pos_x >= Canvas.div.width) {
      cuerpo.pos_x -= Canvas.div.width;
    } else if (cuerpo.pos_y >= Canvas.div.height) {
      cuerpo.pos_y -= Canvas.div.height;
    } else if (cuerpo.pos_x <= 0) {
      cuerpo.pos_x += Canvas.div.width;
    } else if (cuerpo.pos_y <= 0) {
      cuerpo.pos_y += Canvas.div.height;
    }
  }
};

Fisica.actualizar2 = function(datos) {
  for (clave in datos.cuerpos) {
    let cuerpo = datos.cuerpos[clave];
    let posicionAnterior = new Victor(cuerpo.pos_x, cuerpo.pos_y);
    let velocidad = new Victor(cuerpo.vel_x, cuerpo.vel_y);
    Fisica.actualizarPosicionCuerpo(INFO.cuerpos, clave, cuerpo);
    Fisica.verificarPared(cuerpo);
    for (otraClave in datos.cuerpos) {
      let otro = datos.cuerpos[otraClave];
      if (clave != otraClave) {
        interseccion = Geometria.interseccion(Cuerpo.colisionador2Geometria(cuerpo), Cuerpo.colisionador2Geometria(otro));
        if (interseccion) {
          let recta = interseccion;
          //--- MOVERME PARA ATRÁS
          let mV, bV;
          let x2 = otro.pos_x;
          let y2 = otro.pos_y;
          let r1 = cuerpo.colisionador.radio;
          let r2 = otro.colisionador.radio;
          if (velocidad.x == 0) {
            // Busco posición tal que la intersección sea un punto <=>
            // (x1-x2)^2 + (y1-y2)^2 = (r1 + r2)^2
            // (X-x2)^2 + (y1-y2)^2 = (r1 + r2)^2
            // y1^2 -2.y1.y2 +y2^2 = (r1 + r2)^2 - (X-x2)^2
            // Resolvente con a=1, b=-2.y2 y c=(X-x2)^2 - (r1 + r2)^2 + y2^2
            let a = 1;
            let b = -2*y2;
            let c = Math.sq(cuerpo.pos_x-x2) -Math.sq(r1+r2) + Math.sq(y2);
            let ym1 = (-b + Math.sqrt(Math.sq(b)-4*a*c))/(2*a);
            let ym2 = (-b - Math.sqrt(Math.sq(b)-4*a*c))/(2*a);
            debug(function() { Canvas.cruz({x:cuerpo.pos_x, y:ym1}, "#000"); });
            debug(function() { Canvas.cruz({x:cuerpo.pos_x, y:ym2}, "#000"); });
            let d1 = new Victor(cuerpo.pos_x, ym1).subtract(posicionAnterior).length();
            let d2 = new Victor(cuerpo.pos_x, ym2).subtract(posicionAnterior).length();
            if (d1 > d2) {
              cuerpo.pos_y = ym2;
            } else {
              cuerpo.pos_y = ym1;
            }
          } else {
            // Obtengo la recta de la velocidad
            mV = velocidad.y / velocidad.x;
            bV = posicionAnterior.y - mV*posicionAnterior.x;
            // debug(function() { Canvas.recta(posicionAnterior.x, posicionAnterior.y, mV, "#000"); });
            // Entonces, ym = mV*xm + bV

            // Busco posición tal que la intersección sea un punto <=>
            // (x1-x2)^2 + (y1-y2)^2 = (r1 + r2)^2
            // x1^2 -2.x1.x2 +x2^2 + y1^2 -2.y1.y2 +y2^2 = (r1 + r2)^2
            // x1^2 -(2.x2).x1 + (mV.x1 + bV)^2 -(2.y2).(mV.x1 + bV) = (r1 + r2)^2 -x2^2 -y2^2
            // x1^2 -(2.x2).x1 + (mV.x1)^2 +2.mV.x1.bV + bV^2 -(2.y2.mV).x1 -2.y2.bV = (r1 + r2)^2 -x2^2 -y2^2
            // (1 + mV^2).x1^2 + (2.mV.bV-2.x2-2.y2.mV).x1 = (r1 + r2)^2 -x2^2 -y2^2 -bV^2 +2.y2.bV
            // Resolvente con a=(1 + mV^2), b=(2.mV.bV-2.x2-2.y2.mV) y c= x2^2 +y2^2 +bV^2 -2.y2.bV -(r1 + r2)^2
            let a = 1 + Math.sq(mV);
            let b = 2*mV*bV -2*x2 -2*y2*mV;
            let c = Math.sq(x2) +Math.sq(y2) +Math.sq(bV) -2*y2*bV -Math.sq(r1+r2);
            let xm1 = (-b + Math.sqrt(Math.sq(b)-4*a*c))/(2*a);
            let xm2 = (-b - Math.sqrt(Math.sq(b)-4*a*c))/(2*a);
            let ym1 = mV*xm1 + bV;
            let ym2 = mV*xm2 + bV;
            debug(function() { Canvas.cruz({x:xm1, y:ym1}, "#000"); });
            debug(function() { Canvas.cruz({x:xm2, y:ym2}, "#000"); });
            let d1 = new Victor(xm1, ym1).subtract(posicionAnterior).length();
            let d2 = new Victor(xm2, ym2).subtract(posicionAnterior).length();
            if (d1 > d2) {
              cuerpo.pos_x = xm2;
              cuerpo.pos_y = ym2;
            } else {
              cuerpo.pos_x = xm1;
              cuerpo.pos_y = ym1;
            }
          }
          let xT = r2*(cuerpo.pos_x-x2) / (r1+r2) + x2;
          let yT = r2*(cuerpo.pos_y-y2) / (r1+r2) + y2;
          let mPrima;
          if (Math.floatEq(cuerpo.pos_y, y2)) {
            bPrima = xT;
          } else {
            mPrima = -(cuerpo.pos_x-x2) / (cuerpo.pos_y-y2);
            bPrima = yT - mPrima*xT;
          }
          recta = {m: mPrima, b: bPrima};
          debug(function() { Canvas.recta(xT, yT, mPrima, "#0ff"); });
          //---
          let ptoInterseccion = {
            x:r2*(cuerpo.pos_x-x2)/(r1+r2) + x2,
            y:r2*(cuerpo.pos_y-y2)/(r1+r2) + y2
          };
          debug(function() { Canvas.cruz({x:ptoInterseccion.x, y:ptoInterseccion.y}, "#f00"); });
          //debug(function() { Canvas.segmento({x:cuerpo.pos_x, y:cuerpo.pos_y}, {x:cuerpo.pos_x-10*velocidad.x, y:cuerpo.pos_y-10*velocidad.y}, "#00f"); });
          let nuevaVelocidad = Geometria.espejarVector(velocidad, recta);
          //debug(function() { Canvas.segmento({x:cuerpo.pos_x, y:cuerpo.pos_y}, {x:cuerpo.pos_x+10*nuevaVelocidad.x, y:cuerpo.pos_y+10*nuevaVelocidad.y}, "#ff0"); });
          debug(function() { Canvas.segmento({x:cuerpo.pos_x, y:cuerpo.pos_y}, ptoInterseccion, "#ff0"); });
          cuerpo.vel_x = nuevaVelocidad.x;
          cuerpo.vel_y = nuevaVelocidad.y;
        }
      }
    }
  }
};
