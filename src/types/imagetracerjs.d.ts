declare module "imagetracerjs" {
  interface ImageTracerOptions {
    scale?: number;
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    colorsampling?: number;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    blurradius?: number;
    blurdelta?: number;
    strokewidth?: number;
    linefilter?: boolean;
    desc?: boolean;
    viewbox?: boolean;
    rightangleenhance?: boolean;
  }

  const ImageTracer: {
    imagedataToSVG(imageData: ImageData, options?: ImageTracerOptions): string;
    imageToSVG(
      url: string,
      callback: (svgstr: string) => void,
      options?: ImageTracerOptions,
    ): void;
  };

  export default ImageTracer;
}
