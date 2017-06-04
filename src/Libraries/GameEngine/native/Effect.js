/**
 * Created by tdzl2003 on 2017/3/19.
 */
import {AssetType} from "./AssetsManager";

export default class Effect extends AssetType {
  streams;
  passes;

  params = {};

  doLoad(gl) {
    return fetch(this.key)
      .then(resp => resp.json())
      .then(data => this.loadFromData(gl, data));
  }

  unload(gl) {
    super.unload(gl);
    this.stream = null;
    this.passes = null;
    this.params = {};
  }

  loadFromData(gl, data) {
    this.streams = data.streams;
    this.passes = data.passes.map((v, i) => this.loadPass(gl, v, i));
  }

  loadPass(gl, pass, passId) {
    const vs = this.loadShader(gl, gl.VERTEX_SHADER, pass.vs);
    const fs = this.loadShader(gl, gl.FRAGMENT_SHADER, pass.fs);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.deleteShader(vs);
    gl.attachShader(program, fs);
    gl.deleteShader(fs);
    for (let i = 0; i < this.streams.length; i++) {
      const stream = this.streams[i];
      if (stream) {
        gl.bindAttribLocation(program, i, stream.name);
      }
    }

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      const loc = gl.getUniformLocation(program, info.name);
      this.params[info.name] = this.params[info.name] || [];
      this.params[info.name][passId] = loc;
    }

    // bind streams.
    // gl.useProgram(program);
    return program;
  }

  loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  drawArrays(gl, mode, first, count) {
    if (gl.lastUsedEffect) {
      for (let i = this.streams.length; i < gl.lastUsedEffect.stream.length; i++) {
        gl.disableVertexAttribArray(i);
      }
    }
    for (const pass of this.passes) {
      gl.useProgram(pass);
      gl.drawArrays(mode, first, count);
    }
  }

  drawElements(gl, mode, count, type, offset) {
    if (gl.lastUsedEffect && gl.lastUsedEffect !== this) {
      for (let i = this.streams.length; i < gl.lastUsedEffect.streams.length; i++) {
        gl.disableVertexAttribArray(i);
      }
    }
    for (const pass of this.passes) {
      gl.useProgram(pass);
      gl.drawElements(mode, count, type, offset);
    }
    gl.lastUsedEffect = this;
  }

  setParameter1i(gl, name, value) {
    const positions = this.params[name];
    if (positions) {
      for (let i = 0; i < this.passes.length; i++) {
        if (positions[i] !== undefined) {
          const pass = this.passes[i];
          gl.useProgram(pass);
          gl.uniform1i(positions[i], value);
        }
      }
    }
  }
};
