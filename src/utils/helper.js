function dijkstra(n, edges, src, dest) {
  // Step 1: Build adjacency list from edges
  const adjList = Array(n)
    .fill()
    .map(() => []);
  for (let edge of edges) {
    let [u, v, weight] = edge;
    adjList[u].push([v, weight]);
    adjList[v].push([u, weight]);
  }

  // Step 2: Initialize priority queue, parent array, and distance array
  let pq = new MinHeap();
  let parent = new Array(n).fill(-1);
  let dist = new Array(n).fill(Number.MAX_SAFE_INTEGER);
  dist[src] = 0;
  pq.insert([0, src]);

  // Step 3: Dijkstra's algorithm main loop
  while (!pq.isEmpty()) {
    let [cost, node] = pq.extractMin();

    for (let [neighbor, weight] of adjList[node]) {
      if (dist[neighbor] > cost + weight) {
        dist[neighbor] = cost + weight;
        parent[neighbor] = node;
        pq.insert([dist[neighbor], neighbor]);
      }
    }
  }

  // Step 4: Build path from destination to source using parent array
  let path = [];
  let currentNode = dest;
  while (parent[currentNode] !== -1) {
    path.push([currentNode, parent[currentNode]]);
    currentNode = parent[currentNode];
  }
  path.reverse();
  console.log(path);
  return path;
}

// Helper class for MinHeap implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.isEmpty()) return null;
    let minNode = this.heap[0];
    let lastNode = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = lastNode;
      this.bubbleDown(0);
    }
    return minNode;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index][0] < this.heap[parentIndex][0]) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  bubbleDown(index) {
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;

      if (
        leftChildIndex < this.heap.length &&
        this.heap[leftChildIndex][0] < this.heap[smallestChildIndex][0]
      ) {
        smallestChildIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex][0] < this.heap[smallestChildIndex][0]
      ) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex !== index) {
        this.swap(index, smallestChildIndex);
        index = smallestChildIndex;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

export { dijkstra };
