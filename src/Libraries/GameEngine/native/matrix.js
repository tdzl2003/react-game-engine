/**
 * Created by tdzl2003 on 3/24/17.
 */

export function identity(){
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

export function ortho2D(width, height, x, y) {
  return [
    2 / width, 0, 0, 0,
    0,  -2/height, 0, 0,
    0, 0, 1, 0,
    -x/width*2, y/height*2, 0, 1,
  ];
}

//(x,y,z,w)*M*A == (x+dx,y+dy,z+dz, w)*A
//M =
//  1  0  0  0
//  0  1  0  0
//  0  0  1  0
// dx dy dz  1

export function translate2D(m, dx, dy) {
  for (let i = 0; i < 4; i++){
    m[12+i] += m[i] * dx + m[4+i] * dy;
  }
}

//(x,y,z,w)*M*A == (x*sx,y*sy,z*dz, w)*A
//M =
// sx  0  0  0
//  0 sy  0  0
//  0  0 sz  0
//  0  0  0  1
//let A = M*A

export function scale2D(m, sx, sy) {
  for (let i = 0; i < 4; i++){
    m[i] *= sx;
    m[4+i] *= sy;
  }
}

//(x,y,z,w)*M*A == (x*cos-y*sin, y*cos+x*sin, z, w)*A
//M =
// cos -sin  0 0
// sin  cos  0 0
//   0    0  1 0
//   0    0  0 1

export function rotate2DCalced(m, cos, sin) {
  for (let i = 0; i < 4; i++){
    let v1 = cos*m[i] - sin*m[4+i];
    let v2 = sin*m[i] + cos*m[4+i];
    m[i] = v1;
    m[4+i] = v2;
  }
}

export function rotate2D(m, rad) {
  rotate2DCalced(m, Math.cos(rad), Math.sin(rad));
}

export function transpose2D(m, x, y) {
  const x1 = x * m[0] + y * m[4] + m[12];
  const y1 = x * m[1] + y * m[5] + m[13];
  const w = x * m[3] + y * m[7] + m[15];
  return [x1/w, y1/w];
}

export default class MatrixStack {
  values = [];
  reset() {
    this.values.splice(0, this.values.length);
  }
  get top() {
    if (this.values.length === 0) {
      return identity();
    }
    return this.values[this.values.length - 1];
  }
  pushOrtho2D(width, height, x, y) {
    this.values.push(ortho2D(width, height, x, y));
  }
  push() {
    this.values.push([...this.top]);
  }
  pop() {
    return this.values.pop();
  }
  transpose2D(x, y) {
    return transpose2D(this.top, x, y);
  }
}
