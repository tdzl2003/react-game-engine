/**
 * Created by tdzl2003 on 2017/3/19.
 */
import {AssetType} from "./AssetsManager";

function powerOfTwo(num) {
  if( num > 0 )
  {
    num--;
    num |= (num >> 1); //Or first 2 bits
    num |= (num >> 2); //Or next 2 bits
    num |= (num >> 4); //Or next 4 bits
    num |= (num >> 8); //Or next 8 bits
    num |= (num >> 16); //Or next 16 bits
    num++;
  }

  return num;
}

export class ImageTexture extends AssetType {
  texture;
  info = null;

  doLoad(gl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = this.key;
      image.onload = () => {
        this.texture = gl.createTexture();
        const { width, height } = image;
        const texWidth = powerOfTwo(width);
        const texHeight = powerOfTwo(height);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        if (texWidth === width && texHeight === height) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        const err = gl.getError();
        if (err) {
          console.warn(`Load texture error: ${err}`);
        }

        if (__DEV__) {
          console.log(`Texture loaded: ${this.uri} ${width}x${height} (${texWidth}x${texHeight})`);
        }
        this.info = {
          width,
          height,
          texWidth,
          texHeight,
        };
        resolve();
      };
      image.onerror = reject;
    })

  }

  get loaded() {
    return !!this.info;
  }

  unload(gl) {
    super.unload(gl);
    gl.deleteTexture(this.texture);
    this.texture = null;
    this.info = null;
  }
};
