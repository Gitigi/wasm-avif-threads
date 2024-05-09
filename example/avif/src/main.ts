import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { Encoder } from "../../../main"
// import { encode } from 'wasm-avif';

(async function main() {
  const encoder = new Encoder()

  const pic = new Image()
  pic.src = "./photo.jpg"
  await new Promise(resolve => {
    pic.onload = resolve
  })
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const width = 720
  canvas.width = width; // destination canvas size
  canvas.height = canvas.width * pic.height / pic.width;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  pic.height = width * pic.height / pic.width;
  pic.width = width
  ctx.drawImage(pic, 0, 0, pic.width, pic.height)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  console.log('before ', new Uint8Array(imageData.data.buffer))
  const avif = await encoder.encode(new Uint8Array(imageData.data.buffer), imageData.width, imageData.height, 8)
  console.log('after ', avif)
  const blob = new Blob([avif], {type: "image/avif"})
  const file = new File([blob], 'untitled', { type: blob.type })
  const objectURL = URL.createObjectURL(file);
  console.log('url ', objectURL)

  const image = document.getElementById("img") as HTMLImageElement
  image.src = objectURL
})()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
