import AvifWorker from './worker?worker&inline'

export class Encoder {
  constructor() {
    this.requests = {}
    this.requestsCounter = 0;
    this.worker = new AvifWorker()
    this.worker.onmessage = this.onComplete
  }

  /**
  * @param {Uint8Array} buffer
  * @param {number} width
  * @param {number} height
  * @returns {Promise<Uint8Array>}
  */
  async encode(buffer, width, height) {
    const id = `request-${this.requestsCounter++}`;
 
    return new Promise((resolve) => {
      this.requests[id] = (data) => {
          resolve(data);
      };

      this.worker.postMessage({id, data: {buffer, width, height}})
    });
  }

  onComplete = ({data: {id, data}}) => {
    if (typeof this.requests[id] === "function") {
      this.requests[id](data);
      delete this.requests[id];
    }
  }
}
