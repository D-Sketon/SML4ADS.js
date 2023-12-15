export class Scene {
  offset = { x: 0, y: 0 };
  curOffset = { x: 0, y: 0 };
  mousePosition = { x: 0, y: 0 };
  maxScale = 20;
  minScale = 0.4;
  scaleStep = 0.2;
  scale = 1;
  preScale = 1;

  x = 0;
  y = 0;

  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  renderInfo: string;
  postRender: {
    lanelet_array: any[];
    obstacle_array: any[];
    border_array: any[];
  };

  constructor(
    id: string | HTMLCanvasElement,
    renderInfo: string,
    options = {
      width: 600,
      height: 400,
    }
  ) {
    this.canvas = typeof id === 'string' ? document.querySelector("#" + id)! : id;
    this.width = options.width;
    this.height = options.height;
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    this.ctx = this.canvas.getContext("2d")!;
    this.renderInfo = renderInfo;
    this.postRender = JSON.parse(this.renderInfo) as {
      lanelet_array: any[];
      obstacle_array: any[];
      border_array: any[];
    };

    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onMousewheel = this.onMousewheel.bind(this);
    this.canvas.addEventListener("mousewheel", this.onMousewheel);
    this.canvas.addEventListener("mousedown", this.onMousedown);

    const border = {
      xMin: Infinity,
      xMax: -Infinity,
      yMin: Infinity,
      yMax: -Infinity,
    };
    this.getBorder(border);
    // change canvas to center
    const contentWidth = border.xMax - border.xMin;
    const contentHeight = border.yMax - border.yMin;
    const xOffset = (this.canvas.width - contentWidth) / 2;
    const yOffset = (this.canvas.height - contentHeight) / 2;
    this.offset.x = this.curOffset.x = xOffset - border.xMin;
    this.offset.y = this.curOffset.y = yOffset - border.yMin;

    this.ctx.translate(this.offset.x, this.offset.y);
  }

  onMousewheel(e: any) {
    e.preventDefault();

    this.mousePosition.x = e.offsetX;
    this.mousePosition.y = e.offsetY;
    if (e.wheelDelta > 0) {
      this.scale = parseFloat((this.scaleStep + this.scale).toFixed(2));
      if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
        return;
      }
    } else {
      this.scale = parseFloat((this.scale - this.scaleStep).toFixed(2));
      if (this.scale < this.minScale) {
        this.scale = this.minScale;
        return;
      }
    }

    this.zoom();
  }

  zoom() {
    this.offset.x =
      this.mousePosition.x -
      ((this.mousePosition.x - this.offset.x) * this.scale) / this.preScale;
    this.offset.y =
      this.mousePosition.y -
      ((this.mousePosition.y - this.offset.y) * this.scale) / this.preScale;

    this.paint();
    this.preScale = this.scale;
    this.curOffset.x = this.offset.x;
    this.curOffset.y = this.offset.y;
  }

  onMousedown(e: any) {
    if (e.button === 0) {
      this.x = e.x;
      this.y = e.y;
      window.removeEventListener("mousemove", this.onMousemove);
      window.removeEventListener("mouseup", this.onMouseup);
      window.addEventListener("mousemove", this.onMousemove);
      window.addEventListener("mouseup", this.onMouseup);
    }
  }

  onMousemove(e: any) {
    this.offset.x = this.curOffset.x + (e.x - this.x);
    this.offset.y = this.curOffset.y + (e.y - this.y);

    this.paint();
  }

  onMouseup() {
    this.curOffset.x = this.offset.x;
    this.curOffset.y = this.offset.y;
    window.removeEventListener("mousemove", this.onMousemove);
    window.removeEventListener("mouseup", this.onMouseup);
  }

  zoomIn() {
    this.scale += this.scaleStep;
    if (this.scale > this.maxScale) {
      this.scale = this.maxScale;
      return;
    }
    this.mousePosition.x = this.width / 2;
    this.mousePosition.y = this.height / 2;
    this.zoom();
  }

  zoomOut() {
    this.scale -= this.scaleStep;
    if (this.scale < this.minScale) {
      this.scale = this.minScale;
      return;
    }
    this.mousePosition.x = this.width / 2;
    this.mousePosition.y = this.height / 2;
    this.zoom();
  }

  reset() {
    this.clear();
    this.scale = 1;
    this.preScale = 1;
    this.offset = { x: 0, y: 0 };
    this.curOffset = { x: 0, y: 0 };
    this.mousePosition = { x: 0, y: 0 };
    this.draw();
  }

  draw() {
    for (const lanelet of this.postRender.lanelet_array) {
      this.drawLanelet(lanelet);
    }
    for (const obstacle of this.postRender.obstacle_array) {
      this.drawObstacle(obstacle);
    }
    for (const border of this.postRender.border_array) {
      this.drawBorder(border);
    }
  }

  getBorder(border: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  }) {
    for (const lanelet of this.postRender.lanelet_array) {
      for (let i = 0; i < lanelet.left_vertices.length; i++) {
        border.xMin = Math.min(border.xMin, lanelet.left_vertices[i][0]);
        border.xMax = Math.max(border.xMax, lanelet.left_vertices[i][0]);
        border.yMin = Math.min(border.yMin, -lanelet.left_vertices[i][1]);
        border.yMax = Math.max(border.yMax, -lanelet.left_vertices[i][1]);
      }
      for (let i = 0; i < lanelet.right_vertices.length; i++) {
        border.xMin = Math.min(border.xMin, lanelet.right_vertices[i][0]);
        border.xMax = Math.max(border.xMax, lanelet.right_vertices[i][0]);
        border.yMin = Math.min(border.yMin, -lanelet.right_vertices[i][1]);
        border.yMax = Math.max(border.yMax, -lanelet.right_vertices[i][1]);
      }
    }
  }

  drawLanelet(lanelet: {
    left_vertices: [number, number][];
    center_vertices: [number, number][];
    right_vertices: [number, number][];
  }) {
    let color, alpha;
    color = "gray";
    alpha = 0.3;
    // Draw filled area
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(lanelet.left_vertices[0][0], -lanelet.left_vertices[0][1]);

    for (let i = 1; i < lanelet.left_vertices.length; i++) {
      this.ctx.lineTo(
        lanelet.left_vertices[i][0],
        -lanelet.left_vertices[i][1]
      );
    }

    for (let j = lanelet.right_vertices.length - 1; j >= 0; j--) {
      this.ctx.lineTo(
        lanelet.right_vertices[j][0],
        -lanelet.right_vertices[j][1]
      );
    }

    this.ctx.closePath();
    this.ctx.globalAlpha = alpha;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;

    // Draw left and right vertices as lines
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 0.1;

    this.ctx.beginPath();
    for (let k = 0; k < lanelet.left_vertices.length; k++) {
      this.ctx.lineTo(
        lanelet.left_vertices[k][0],
        -lanelet.left_vertices[k][1]
      );
    }
    this.ctx.stroke();

    this.ctx.beginPath();
    for (let l = 0; l < lanelet.right_vertices.length; l++) {
      this.ctx.lineTo(
        lanelet.right_vertices[l][0],
        -lanelet.right_vertices[l][1]
      );
    }
    this.ctx.stroke();
  }

  drawObstacle(obstacle: {
    center: [number, number];
    width: number;
    length: number;
    orientation: number;
    type: string;
    heading: boolean,
    road_deviation: number,
    name: string,
  }) {
    const x: number = obstacle.center[0];
    const y: number = -obstacle.center[1];
    let { width, length, orientation: angle, type, heading, road_deviation } = obstacle;

    if(!heading) {
      angle = -angle;
    }
    angle += road_deviation;
    const x1: number =
      x + (length / 2) * Math.cos(angle) - (width / 2) * Math.sin(angle);
    const y1: number =
      y + (length / 2) * Math.sin(angle) + (width / 2) * Math.cos(angle);
    const x2: number =
      x - (length / 2) * Math.cos(angle) - (width / 2) * Math.sin(angle);
    const y2: number =
      y - (length / 2) * Math.sin(angle) + (width / 2) * Math.cos(angle);
    const x3: number =
      x - (length / 2) * Math.cos(angle) + (width / 2) * Math.sin(angle);
    const y3: number =
      y - (length / 2) * Math.sin(angle) - (width / 2) * Math.cos(angle);
    const x4: number =
      x + (length / 2) * Math.cos(angle) + (width / 2) * Math.sin(angle);
    const y4: number =
      y + (length / 2) * Math.sin(angle) - (width / 2) * Math.cos(angle);

    const lineEndX = x + length * 1.2 * Math.cos(angle);
    const lineEndY = y + length * 1.2 * Math.sin(angle);
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x4, y4);
    this.ctx.closePath();

    if (type === "Ego") {
      this.ctx.fillStyle = "red";
      this.ctx.strokeStyle = "red";
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.strokeStyle = "black";
    }
    this.ctx.lineWidth = 0.1;
    this.ctx.fill();
    this.ctx.font = '3px Arial';
    this.ctx.fillText(obstacle.name, obstacle.center[0] + 3, -obstacle.center[1]);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(lineEndX, lineEndY);
    this.ctx.stroke();
  }

  drawBorder(border: {
    type: string;
    start_vertices_idx?: number;
    end_vertices_idx?: number;
    lanelet_id?: number;
    width: number;
    center_vertices: [number, number][];
  }) {
    let color;
    if (border.type === "Ego") {
      color = "red";
    } else {
      color = "black";
    }
    const { center_vertices, width } = border;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(center_vertices[0][0], -center_vertices[0][1]);
    for (let k = 1; k < center_vertices.length; k++) {
      this.ctx.lineTo(center_vertices[k][0], -center_vertices[k][1]);
    }
    this.ctx.lineWidth = width + 1.5;
    this.ctx.globalAlpha = 0.2;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }

  clear() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  paint() {
    this.clear();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);
    this.draw();
  }
}
