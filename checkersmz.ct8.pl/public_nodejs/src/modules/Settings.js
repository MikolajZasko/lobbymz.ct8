import {

    MeshBasicMaterial,
    DoubleSide,
    TextureLoader

} from "three";

import imgUrl from '../gfx/wood.jpg'

// load texture
const imageTexture = new TextureLoader().load(imgUrl)


const Settings = {
    whiteMaterial: new MeshBasicMaterial({
        map: imageTexture,
        side: DoubleSide,
        transparent: true,
        color: 0xc9c7c7,
    }),
    blackMaterial: new MeshBasicMaterial({
        map: imageTexture,
        side: DoubleSide,
        transparent: true,
        color: 0x000000,
    }),
    blackPionekMaterial: new MeshBasicMaterial({
        map: imageTexture,
        side: DoubleSide,
        transparent: true,
        color: 0x525252,
    }),
    whitePionekMaterial: new MeshBasicMaterial({
        map: imageTexture,
        side: DoubleSide,
        transparent: true,
        color: 0xffffff,
    }),
    pionekSelectedMaterial: new MeshBasicMaterial({
        color: 0xffdc7a,
        side: DoubleSide,
        wireframe: false,
        transparent: false
    }),
}

export { Settings }