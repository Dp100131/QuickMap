import GraphVertex from "./GraphVertex.js";
import GraphEdge from "./GraphEdge.js";

export default class Graph {

	/**
	 * @param {boolean} isDirected
	 */
	constructor(isDirected = false) {

	  this.vertices = {};

	  this.edges = {};

	  this.isDirected = isDirected;

	}
  
	/**
	 * @param {GraphVertex} newVertex
	 * @returns {Graph}
	 */
	addVertex(newVertex) {

	  this.vertices[newVertex.getKey()] = newVertex;
  
	  return this;

	}
  
	/**
	 * @param {string} vertexKey
	 * @returns {GraphVertex}
	 */
	getVertexByKey(vertexKey) {

	  return this.vertices[vertexKey];

	}
  
	/**
	 * @param {GraphVertex} vertex
	 * @returns {GraphVertex[]}
	 */
	getNeighbors(vertex) {

	  return vertex.getNeighbors();

	}
  
	/**
	 * @return {GraphVertex[]}
	 */
	getAllVertices() {

	  return Object.values(this.vertices);

	}
  
	/**
	 * @return {GraphEdge[]}
	 */
	getAllEdges() {

	  return Object.values(this.edges);

	}
  
	/**
	 * @param {GraphEdge} edge
	 * @returns {Graph}
	 */
	addEdge(edge) {

	  // Intenta encontrar y  los vértices de inicio a fin.
	  let startVertex = this.getVertexByKey(edge.startVertex.getKey());

	  let endVertex = this.getVertexByKey(edge.endVertex.getKey());
  
	  // Inserta el vértice de inicio si no se insertó.
	  if (!startVertex) {

		this.addVertex(edge.startVertex);

		startVertex = this.getVertexByKey(edge.startVertex.getKey());

	  }
  
	  // Insert end vertex if it wasn't inserted.
	  if (!endVertex) {

		this.addVertex(edge.endVertex);

		endVertex = this.getVertexByKey(edge.endVertex.getKey());

	  }
  
	  // Inserta el vértice final si no se insertó.
	  if (this.edges[edge.getKey()]) {

		throw new Error('Edge has already been added before');

	  } else {

		this.edges[edge.getKey()] = edge;

	  }
  
	  // Agrega arista a los nodos.
	  if (this.isDirected) {

		// Si el grafo ES dirigido, agregua la arista solo para el nodo de inicio.
		startVertex.addEdge(edge);

	  } else {

		// Si el grafo NO ESTÁ dirigido, agregue el borde a ambos nodos.
		startVertex.addEdge(edge);

		endVertex.addEdge(edge);

	  }
  
	  return this;

	}
  
	/**
	 * @param {GraphEdge} edge
	 */
	deleteEdge(edge) {

	  // Elimina la arista de la lista de aristas.
	  if (this.edges[edge.getKey()]) {

		delete this.edges[edge.getKey()];

	  } else {

		throw new Error('Edge not found in graph');

	  }
  
	  // Intenta encontrar y los nodos de inicio y fin y elimina la arista de ellos.
	  const startVertex = this.getVertexByKey(edge.startVertex.getKey());

	  const endVertex = this.getVertexByKey(edge.endVertex.getKey());
  
	  startVertex.deleteEdge(edge);

	  endVertex.deleteEdge(edge);

	}
  
	/**
	 * @param {GraphVertex} startVertex
	 * @param {GraphVertex} endVertex
	 * @return {(GraphEdge|null)}
	 */
	findEdge(startVertex, endVertex) {

	  const vertex = this.getVertexByKey(startVertex.getKey());
  
	  if (!vertex) {

		return null;

	  }
  
	  return vertex.findEdge(endVertex);

	}
  
	/**
	 * @return {number}
	 */
	getWeight() {

	  return this.getAllEdges().reduce((weight, graphEdge) => {

		return weight + graphEdge.weight;

	  }, 0);

	}
  
	/**
	 * Invierte todas las aristas en el grafo dirigido.
	 * @return {Graph}
	 */
	reverse() {

	  /** @param {GraphEdge} edge */
	  this.getAllEdges().forEach((edge) => {

		// Elimina la arista recto del grafo y de los nodos.
		this.deleteEdge(edge);
  
		// Invierte la arista.
		edge.reverse();
  
		// Agregua la arista invertida nuevamente al grafo y sus nodos.
		this.addEdge(edge);

	  });
  
	  return this;
	}
  
	/**
	 * @return {object}
	 */
	getVerticesIndices() {

	  const verticesIndices = {};

	  this.getAllVertices().forEach((vertex, index) => {

		verticesIndices[vertex.getKey()] = index;

	  });
  
	  return verticesIndices;
	}
  
	/**
	 * @return {*[][]}
	 */
	getAdjacencyMatrix() {

	  const vertices = this.getAllVertices();

	  const verticesIndices = this.getVerticesIndices();
  
	  // Matriz de inicio con infinitos, lo que significa que todavía no hay forma de pasar de un nodo a otro.
	  const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
		return Array(vertices.length).fill(Infinity);
	  });
  
	  // Llena las columnas.
	  vertices.forEach((vertex, vertexIndex) => {

		vertex.getNeighbors().forEach((neighbor) => {

		  const neighborIndex = verticesIndices[neighbor.getKey()];

		  adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(vertex, neighbor).weight;
		
		});

	  });
  
	  return adjacencyMatrix;
	}
  
	/**
	 * @return {string}
	 */
	toString() {

	  return Object.keys(this.vertices).toString();

	}
  }