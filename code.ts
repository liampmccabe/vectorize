/**
 * VectorizeImage
 *
 * Node has to contain an image fill
 *
 * @param node
 */

async function VectorizeImage() {
  const node: any = figma.currentPage.selection[0];

  if (!node) {
    return figma.closePlugin();
  }

  for (const paint of node.fills) {
    if (paint.type !== "IMAGE") {
      return figma.closePlugin();
    }

    // Get image data
    const image = figma.getImageByHash(paint.imageHash);
    const imageData = await image.getBytesAsync();

    // Set up worker
    figma.showUI(__html__, { visible: false });
    figma.ui.postMessage({ type: "networkRequest", imageData });

    // Listen to worker
    figma.ui.onmessage = async (msg) => {
      // Create vector node
      const svgNode = figma.createNodeFromSvg(msg.data);

      svgNode.name = `${node.name} (vectorized)`;
      svgNode.x = node.x + node.width + 40;
      svgNode.y = node.y;

      // Done!
      figma.closePlugin();
    };
  }
}

VectorizeImage();
