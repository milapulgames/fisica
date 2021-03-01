const Fisica = {
  ESTATICO: "Estático",
  DINAMICO: "Dinámico"
};
PAREDES = true;

Fisica.actualizar = function(datos) {
  for (clave in datos.cuerpos) {
    Fisica.actualizarVelocidadCuerpo(datos.cuerpos, clave, datos.cuerpos[clave]);
    Fisica.actualizarPosicionCuerpo(datos.cuerpos, clave, datos.cuerpos[clave]);
  }
};

Fisica.actualizarVelocidadCuerpo = function(cuerpos, clave, cuerpo) {
  for (otraClave in cuerpos) {
    let otro = cuerpos[otraClave];
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
  Fisica.verificarPared(cuerpo);
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
  interseccion = Geometria.interseccion(cuerpo, otro);
  if (interseccion) {
    let recta = Geometria.rectaQuePasaPorDosPuntos(interseccion[0], interseccion[1]);
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
