/* tslint:disable */
/* eslint-disable */
export class Encoder {
  /**
  * @param {Uint8Array} buffer
  * @param {number} width
  * @param {number} height
  * @param {number} speed
  * @returns {Promise<Uint8Array>}
  */
  async  encode(buffer: Uint8Array, width: number, height: number, speed: number = 4): Promise<Uint8Array>;
}
