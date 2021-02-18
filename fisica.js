Fisica = {};
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
    if (clave != otraClave && Fisica.colisiona(cuerpo, otro)) {

      /*cuerpo.vel_x *= -1;
      cuerpo.vel_y *= -1;
      otro.vel_x *= -1;
      otro.vel_y *= -1;*/
    }
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
  let pos1 = new Victor(cuerpo.pos_x, cuerpo.pos_y).add(new Victor(cuerpo.vel_x, cuerpo.vel_y));
  let pos2 = new Victor(otro.pos_x, otro.pos_y).add(new Victor(otro.vel_x, otro.vel_y));
  let distancia = pos1.subtract(pos2).length();
  return (distancia < cuerpo.radio + otro.radio);
};

Fisica.verificarPared = function(cuerpo) {
  if (PAREDES) {
    if (cuerpo.pos_x >= Canvas.div.width) {
      cuerpo.pos_x = Canvas.div.width;
      cuerpo.vel_x *= -1;
    } else if (cuerpo.pos_y >= Canvas.div.height) {
      cuerpo.pos_y = Canvas.div.height;
      cuerpo.vel_y *= -1;
    } else if (cuerpo.pos_x <= 0) {
      cuerpo.pos_x = 0;
      cuerpo.vel_x *= -1;
    } else if (cuerpo.pos_y <= 0) {
      cuerpo.pos_y = 0;
      cuerpo.vel_y *= -1;
    }
  } else {
    if (cuerpo.pos_x >= Canvas.div.width) {
      cuerpo.pos_x = 0;
    } else if (cuerpo.pos_y >= Canvas.div.height) {
      cuerpo.pos_y = 0;
    } else if (cuerpo.pos_x <= 0) {
      cuerpo.pos_x = Canvas.div.width;
    } else if (cuerpo.pos_y <= 0) {
      cuerpo.pos_y = Canvas.div.height;
    }
  }
};

Fisica.colisionParedPelota = function(cuerpo, linea) {
  let r = cuerpo.radio;
  let a = cuerpo.pos_x;
  let b = cuerpo.pos_y;
  let m = linea.m;
  let d = linea.b;
  //r^2(1+m^2)-(b-ma-d)^2
  let D = Math.pow(r,2)*(1+Math.pow(m,2)) - Math.pow(b-m*a-d,2);
  if (D <= 0) {
    return;
  }
  let x12 = new Victor(
    (a+b*m - d*m + Math.sqrt(D)) / (1+Math.pow(m,2)),
    (d+a*m + b*Math.pow(m,2) + m*Math.sqrt(D)) / (1+Math.pow(m,2))
  );
  let y12 = new Victor(
    (a+b*m - d*m - Math.sqrt(D)) / (1+Math.pow(m,2)),
    (d+a*m + b*Math.pow(m,2) - m*Math.sqrt(D)) / (1+Math.pow(m,2))
  );
  Canvas.circulo(x12.x, x12.y, 3, "#000");
  Canvas.circulo(y12.x, y12.y, 3, "#000");
};
