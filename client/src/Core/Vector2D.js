class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // 向量加法
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  // 向量減法
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  // 向量縮放
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // 計算向量的長度
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // 將向量正規化 (轉換為單位向量)
  normalize() {
    const length = this.length();
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
    return this;
  }

  // 計算兩個向量之間的距離
  distance(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  // 計算向量的點積
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  // 返回一個新的向量副本
  clone() {
    return new Vector2D(this.x, this.y);
  }

  // 設置向量的值
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  // 打印向量的值
  toString() {
    return `Vector2D(${this.x}, ${this.y})`;
  }
}

export default Vector2D;