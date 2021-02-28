const Geometria = {};

// Agrego la función sq a Math para calcular rápido el cuadrado de un número
Math.sq = function(x) { return x*x; };

// Dada una recta representada con su base y pendiente,
// devuelve el ángulo en radiandes que dicha recta forma con el eje horizontal.
// rango del resultado [0, PI), es decir, [0°, 180°)
Geometria.anguloDeRecta = function(recta) {
  if (recta.m === undefined) {
    // recta vertical, el ángulo es PI/2 (90°)
    return Math.PI / 2;
  } else {
    angulo = Math.atan(recta.m); // (-PI/2, PI/2) (-90°, 90°)
    if (angulo < 0) {
      angulo += Math.PI; // Paso de (-PI/2, 0) a (PI/2, PI)
    }                    //         (-90°, 0)  a (90°, 180°)
    return angulo; // [0, PI/2) U (PI/2, PI)
  }                // [0°, 90°] U (90°, 180°)
};

// Dados dos puntos en el plano representados con sus coordenadas x-y,
// devuelve la recta representada con su base y pendiente que pasa por ambos.
Geometria.rectaQuePasaPorDosPuntos = function(pto1, pto2) {
  if (pto2.x == pto1.x) { // es una recta vertical
    return {
      m: undefined,
      b: pto2.x
    };
  }
  let m = (pto2.y-pto1.y)/(pto2.x-pto1.x); // calculo la pendiente
  let b = pto2.y - m*pto2.x // y = m*x + b <=> b = y - m*x
  return {
    m: m,
    b: b
  };
};

// Si hay intersección devuelve dos puntos
// Si no, devuelve undefined
Geometria.interseccion = function(uno, otro) {
  if (uno.colisionador.tipo == COLISIONADOR.CIRCULO && otro.colisionador.tipo == COLISIONADOR.CIRCULO) {
    /*
    C1: (x-a)^2 + (y-b)^2 = ro^2
    C2: (x-c)^2 + (y-d)^2 = ri^2
    D = ¬/(c-a)^2 + (d-b)^2
    Hay intersección si: ro + ri > D > |ro-ri|
      -> la segunda condición contempla que uno esté dentro de otro
    Recta de colisión (si b =/= d):
          (a-c)     (ro^2-ri^2) + (c^2-a^2) + (d^2-b^2)
      y = ----- x  + ----------------------------------
          (d-b)                 2(d-b)
      -> Si b == d, la recta es la vertical que pasa por x = a + (z^2 - ro^2 + ri^2) / 2z con z = (c-a)
    */
    let a = uno.pos_x;
    let b = uno.pos_y;
    let c = otro.pos_x;
    let d = otro.pos_y;
    let ro = uno.colisionador.radio;
    let ri = otro.colisionador.radio
    let D = Math.sqrt(Math.sq(c-a) + Math.sq(d-b));
    if (ro+ri > D && D > Math.abs(ro-ri)) {
      if (b != d) {
        let Q = Math.sqrt(
          (D+ro+ri)*(D+ro-ri)*(D-ro+ri)*(-D+ro+ri)
        )/4;
        let resultado = [
          {x: (a+c)/2 + (c-a)*(Math.sq(ro)-Math.sq(ri))/(2*Math.sq(D)) + 2*(b-d)*Q/Math.sq(D),
            y: (b+d)/2 + (d-b)*(Math.sq(ro)-Math.sq(ri))/(2*Math.sq(D)) - 2*(a-c)*Q/Math.sq(D)},
          {x: (a+c)/2 + (c-a)*(Math.sq(ro)-Math.sq(ri))/(2*Math.sq(D)) - 2*(b-d)*Q/Math.sq(D),
          y: (b+d)/2 + (d-b)*(Math.sq(ro)-Math.sq(ri))/(2*Math.sq(D)) + 2*(a-c)*Q/Math.sq(D)}
        ];
          // Muestro la recta en el canvas:
          let r = Geometria.rectaQuePasaPorDosPuntos(resultado[0], resultado[1]);
          debug(function() { Canvas.recta(0, r.b, r.m, "#000"); });
        return resultado;
      }
    }
  }
  return undefined;
};

Geometria.interseccionCirculoRecta = function(cuerpo, recta) {
  let r = cuerpo.radio;
  let a = cuerpo.pos_x;
  let b = cuerpo.pos_y;
  let m = recta.m;
  let d = recta.b;
  //r^2(1+m^2)-(b-ma-d)^2
  let D = Math.sq(r)*(1+Math.sq(m)) - Math.sq(b-m*a-d);
  if (D <= 0) {
    return;
  }
  let x12 = new Victor(
    (a+b*m - d*m + Math.sqrt(D)) / (1+Math.sq(m)),
    (d+a*m + b*Math.sq(m) + m*Math.sqrt(D)) / (1+Math.sq(m))
  );
  let y12 = new Victor(
    (a+b*m - d*m - Math.sqrt(D)) / (1+Math.sq(m)),
    (d+a*m + b*Math.sq(m) - m*Math.sqrt(D)) / (1+Math.sq(m))
  );
  debug(function() { Canvas.circulo(x12.x, x12.y, 3, "#000"); });
  debug(function() { Canvas.circulo(y12.x, y12.y, 3, "#000"); });
};

// Devuelve el vector resultante de espejar al
// vector 'vector' respecto a la recta 'recta'
Geometria.espejarVector = function(vector, recta) {
  let espejo = new Victor(1, recta.m);
  let k = vector.dot(espejo) / espejo.dot(espejo);
  return new Victor(-vector.x, -vector.y).add(new Victor(2*k*espejo.x, 2*k*espejo.y));
};