declare module 'dom-to-image-more' {
  interface Options {
    width?: number;
    height?: number;
    scale?: number;
    quality?: number;
    bgcolor?: string;
    copyDefaultStyles?: boolean;
  }

  interface DomToImage {
    toPng(node: HTMLElement, options?: Options): Promise<string>;
    toJpeg(node: HTMLElement, options?: Options): Promise<string>;
    toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
    toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;
  }

  const domToImage: DomToImage;
  export default domToImage;
} 