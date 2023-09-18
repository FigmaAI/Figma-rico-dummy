let index = parseInt(figma.root.getPluginData('index') || '0');

figma.showUI(__html__, { width: 480, height: 400 });
figma.ui.postMessage({ type: 'init', index });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'update-index') {
    index = msg.index;
    figma.root.setPluginData('index', index.toString());
  } else if (msg.type === 'create-texts') {
    const fileContents = JSON.parse(msg.fileContents);
    const fileName = msg.fileName;

    const frame = figma.createFrame();
    frame.resize(1440, 2560);
    frame.name = fileName;
    frame.x = (index % 100) * 1500; // Move the frame to avoid overlap
    frame.y = Math.floor(index / 100) * 2400;

    figma.currentPage.appendChild(frame);

    const createLayers = (node, parent) => {
      const layer = figma.createRectangle();
      layer.name = node.componentLabel || node.class;
      layer.resize(node.bounds[2] - node.bounds[0], node.bounds[3] - node.bounds[1]);
      layer.x = node.bounds[0];
      layer.y = node.bounds[1];

      let newParent = parent;

      if (node.children && node.children.length > 0) {
        const group = figma.group([layer], parent);
        group.name = node.componentLabel || node.class;
        newParent = group;
      } else {
        parent.appendChild(layer);
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((childNode) => {
          try {
            createLayers(childNode, newParent);
          } catch (error) {
            console.error(`Failed to create layer for node: ${childNode.componentLabel || childNode.class}`, error);
          }
        });
      }
    };

    fileContents.children.forEach((node) => createLayers(node, frame));

    index++;
    figma.root.setPluginData('index', index.toString());
    figma.ui.postMessage({ type: 'init', index });
  } else if (msg.type === 'init') {
    figma.ui.postMessage({ type: 'init', index });
  }
};