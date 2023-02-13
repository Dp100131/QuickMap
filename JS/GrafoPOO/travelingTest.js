class Comparator {
	/**
	 * Constructor.
	 * @param {function(a: *, b: *)} [compareFunction] - It may be custom compare function that, let's
	 * say may compare custom objects together.
	 */
	constructor(compareFunction) {
	  this.compare = compareFunction || Comparator.defaultCompareFunction;
	}
  
	/**
	 * Default comparison function. It just assumes that "a" and "b" are strings or numbers.
	 * @param {(string|number)} a
	 * @param {(string|number)} b
	 * @returns {number}
	 */
	static defaultCompareFunction(a, b) {
	  if (a === b) {
		return 0;
	  }
  
	  return a < b ? -1 : 1;
	}
  
	/**
	 * Checks if two variables are equal.
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	equal(a, b) {
	  return this.compare(a, b) === 0;
	}
  
	/**
	 * Checks if variable "a" is less than "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	lessThan(a, b) {
	  return this.compare(a, b) < 0;
	}
  
	/**
	 * Checks if variable "a" is greater than "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	greaterThan(a, b) {
	  return this.compare(a, b) > 0;
	}
  
	/**
	 * Checks if variable "a" is less than or equal to "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	lessThanOrEqual(a, b) {
	  return this.lessThan(a, b) || this.equal(a, b);
	}
  
	/**
	 * Checks if variable "a" is greater than or equal to "b".
	 * @param {*} a
	 * @param {*} b
	 * @return {boolean}
	 */
	greaterThanOrEqual(a, b) {
	  return this.greaterThan(a, b) || this.equal(a, b);
	}
  
	/**
	 * Reverses the comparison order.
	 */
	reverse() {
	  const compareOriginal = this.compare;
	  this.compare = (a, b) => compareOriginal(b, a);
	}
  }
class LinkedListNode {
    constructor(value, next = null) {
      this.value = value;
      this.next = next;
    }
  
    toString(callback) {
      return callback ? callback(this.value) : `${this.value}`;
    }
  }

class LinkedList {
    /**
     * @param {Function} [comparatorFunction]
     */
    constructor(comparatorFunction) {
      /** @var LinkedListNode */
      this.head = null;
  
      /** @var LinkedListNode */
      this.tail = null;
  
      this.compare = new Comparator(comparatorFunction);
    }
  
    /**
     * @param {*} value
     * @return {LinkedList}
     */
    prepend(value) {
      // Make new node to be a head.
      const newNode = new LinkedListNode(value, this.head);
      this.head = newNode;
  
      // If there is no tail yet let's make new node a tail.
      if (!this.tail) {
        this.tail = newNode;
      }
  
      return this;
    }
  
    /**
     * @param {*} value
     * @return {LinkedList}
     */
    append(value) {
      const newNode = new LinkedListNode(value);
  
      // If there is no head yet let's make new node a head.
      if (!this.head) {
        this.head = newNode;
        this.tail = newNode;
  
        return this;
      }
  
      // Attach new node to the end of linked list.
      this.tail.next = newNode;
      this.tail = newNode;
  
      return this;
    }
  
    /**
     * @param {*} value
     * @return {LinkedListNode}
     */
    delete(value) {
      if (!this.head) {
        return null;
      }
  
      let deletedNode = null;
  
      // If the head must be deleted then make next node that is different
      // from the head to be a new head.
      while (this.head && this.compare.equal(this.head.value, value)) {
        deletedNode = this.head;
        this.head = this.head.next;
      }
  
      let currentNode = this.head;
  
      if (currentNode !== null) {
        // If next node must be deleted then make next node to be a next next one.
        while (currentNode.next) {
          if (this.compare.equal(currentNode.next.value, value)) {
            deletedNode = currentNode.next;
            currentNode.next = currentNode.next.next;
          } else {
            currentNode = currentNode.next;
          }
        }
      }
  
      // Check if tail must be deleted.
      if (this.compare.equal(this.tail.value, value)) {
        this.tail = currentNode;
      }
  
      return deletedNode;
    }
  
    /**
     * @param {Object} findParams
     * @param {*} findParams.value
     * @param {function} [findParams.callback]
     * @return {LinkedListNode}
     */
    find({ value = undefined, callback = undefined }) {
      if (!this.head) {
        return null;
      }
  
      let currentNode = this.head;
  
      while (currentNode) {
        // If callback is specified then try to find node by callback.
        if (callback && callback(currentNode.value)) {
          return currentNode;
        }
  
        // If value is specified then try to compare by value..
        if (value !== undefined && this.compare.equal(currentNode.value, value)) {
          return currentNode;
        }
  
        currentNode = currentNode.next;
      }
  
      return null;
    }
  
    /**
     * @return {LinkedListNode}
     */
    deleteTail() {
      const deletedTail = this.tail;
  
      if (this.head === this.tail) {
        // There is only one node in linked list.
        this.head = null;
        this.tail = null;
  
        return deletedTail;
      }
  
      // If there are many nodes in linked list...
  
      // Rewind to the last node and delete "next" link for the node before the last one.
      let currentNode = this.head;
      while (currentNode.next) {
        if (!currentNode.next.next) {
          currentNode.next = null;
        } else {
          currentNode = currentNode.next;
        }
      }
  
      this.tail = currentNode;
  
      return deletedTail;
    }
  
    /**
     * @return {LinkedListNode}
     */
    deleteHead() {
      if (!this.head) {
        return null;
      }
  
      const deletedHead = this.head;
  
      if (this.head.next) {
        this.head = this.head.next;
      } else {
        this.head = null;
        this.tail = null;
      }
  
      return deletedHead;
    }
  
    /**
     * @param {*[]} values - Array of values that need to be converted to linked list.
     * @return {LinkedList}
     */
    fromArray(values) {
      values.forEach((value) => this.append(value));
  
      return this;
    }
  
    /**
     * @return {LinkedListNode[]}
     */
    toArray() {
      const nodes = [];
  
      let currentNode = this.head;
      while (currentNode) {
        nodes.push(currentNode);
        currentNode = currentNode.next;
      }
  
      return nodes;
    }
  
    /**
     * @param {function} [callback]
     * @return {string}
     */
    toString(callback) {
      return this.toArray().map((node) => node.toString(callback)).toString();
    }
  
    /**
     * Reverse a linked list.
     * @returns {LinkedList}
     */
    reverse() {
      let currNode = this.head;
      let prevNode = null;
      let nextNode = null;
  
      while (currNode) {
        // Store next node.
        nextNode = currNode.next;
  
        // Change next node of the current node so it would link to previous node.
        currNode.next = prevNode;
  
        // Move prevNode and currNode nodes one step forward.
        prevNode = currNode;
        currNode = nextNode;
      }
  
      // Reset head and tail.
      this.tail = this.head;
      this.head = prevNode;
  
      return this;
    }
  }
class Graph {

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

class GraphEdge {
	/**
	 * @param {GraphVertex} startVertex
	 * @param {GraphVertex} endVertex
	 * @param {number} [weight=1]
	 */
	constructor(startVertex, endVertex, weight = 0) {

	  this.startVertex = startVertex;
	  this.endVertex = endVertex;
	  this.weight = weight;

	}
  
	/**
	 * @return {string}
	 */
	getKey() {

	  const startVertexKey = this.startVertex.getKey();
	  const endVertexKey = this.endVertex.getKey();
  
	  return `${startVertexKey}_${endVertexKey}`;

	}
  
	/**
	 * @return {GraphEdge}
	 */
	reverse() {

	  const tmp = this.startVertex;
	  this.startVertex = this.endVertex;
	  this.endVertex = tmp;
  
	  return this;

	}
  
	/**
	 * @return {string}
	 */
	toString() {

	  return this.getKey();

	}

}

class GraphVertex {

	/**
	 * 
	 * @param {Integer} id 
	 * @param {String} name 
	 * @param {Number} lat 
	 * @param {Number} lng 
	 */
	constructor(id, name, lat, lng) {

	  this.id = id;
	  this.name = name;
	  this.lat = lat;
	  this.lng = lng;
	  
	  const edgeComparator = (edgeA, edgeB) => {

		if (edgeA.getKey() === edgeB.getKey()) {

		  return 0;

		}
  
		return edgeA.getKey() < edgeB.getKey() ? -1 : 1;

	  };

	  this.value = id;
	  this.edges = new LinkedList(edgeComparator);

	}

	/**
     * @param {GraphEdge} edge
     */
	addEdge(edge) {

		this.edges.append(edge);

	}

	/**
    * @param {GraphEdge} edge
    */
	deleteEdge(edge) {

		this.edges.delete(edge);

	}

	/**
	 * @returns {GraphVertex[]}
	 */
	getNeighbors() {

		const edges = this.edges.toArray();
	
		/** @param {LinkedListNode} node */
		const neighborsConverter = (node) => {
		  return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
		};
	
		// Devuelve el vértice inicial o final.
		// Para grafos no dirigidos es posible que el vértice actual sea el final.
		return edges.map(neighborsConverter);
	}

	/**
	 * @return {GraphEdge[]}
	 */
	getEdges() {

		return this.edges.toArray().map((linkedListNode) => linkedListNode.value);

	}

	/**
	 * @return {number}
	 */
	getDegree() {

		return this.edges.toArray().length;
	}

	/**
	 * @param {GraphEdge} requiredEdge
	 * @returns {boolean}
	 */
	hasEdge(requiredEdge) {

		const edgeNode = this.edges.find({

		  callback: (edge) => edge === requiredEdge,

		});
	
		return !!edgeNode;

	}

	/**
	 * @param {GraphVertex} vertex
	 * @returns {boolean}
	 */
	hasNeighbor(vertex) {

		const vertexNode = this.edges.find({

		  callback: (edge) => edge.startVertex === vertex || edge.endVertex === vertex,

		});
	
		return !!vertexNode;
	}

	/**
	 * @param {GraphVertex} vertex
	 * @returns {(GraphEdge|null)}
	 */
	findEdge(vertex) {

		const edgeFinder = (edge) => {

		  return edge.startVertex === vertex || edge.endVertex === vertex;

		};
	
		const edge = this.edges.find({ callback: edgeFinder });
	
		return edge ? edge.value : null;
	}

	/**
	 * @returns {string}
	 */
	getKey() {

		return this.value;

	}

	/**
	 * @return {GraphVertex}
	 */
	deleteAllEdges() {

		this.getEdges().forEach((edge) => this.deleteEdge(edge));
	
		return this;

	}

	/**
	 * @param {function} [callback]
	 * @returns {string}
	 */
	toString(callback) {

		return callback ? callback(this.value) : `${this.value}`;
	}

}

var nodos = [
    {
        "id" : 0,
        "name": "Entrada",
        "lat": 9.521143181626437,
        "lng": -75.57646129804014

    },
    {
        "id" : 1, 
        "name": "Quintina_Food",
        "lat" : 9.520456044689697,
        "lng" : -75.5828398433738 
    },
    {
        "id" : 2, 
        "name": "Arepas_El_Willi",
        "lat" : 9.522014344704946,
        "lng" : -75.58477488167529 
    },        
    {
        "id" : 3, 
        "name": "EL_PALO_É_MANGO",
        "lat" : 9.523034859535468, 
        "lng" : -75.58184075453715
    },
    {
        "id" : 4, 
        "name": "CANELA,_CAÑA_Y_CAVA",
        "lat" :9.52223253846721,  
        "lng" : -75.58006440371794
    }, 
    {
        "id" : 5, 
        "name": "Bar_y_Restaurante_Los_Arrieros",
        "lat" :9.525350396482555,   
        "lng" :-75.58297476584683
    },
    {
        "id" : 6, 
        "name": "Pollos_Comby",
        "lat" :9.52805107030603,   
        "lng" :-75.58039560316385
    },     
    {
        "id" : 7, 
        "name": "Punto_frio_mafufo",
        "lat" :9.519229016934352,    
        "lng" :-75.58349992322981 
    },  
    {
        "id" : 8, 
        "name": "Restaurante_El_Paisa",
        "lat" :9.517293824727563,    
        "lng" :-75.57967871091576
    },
    {
        "id" : 9, 
        "name": "PANA'S_BURGUER_FAST_FOOD_&_FRITE",
        "lat" :9.514487432784678,   
        "lng" :-75.58377838738622
    }
]

var edges = [
    {
		"sourceNode": 0,
		"destinationNode": 1,
		"weight": 950
	},
	{
		"sourceNode": 0,
		"destinationNode": 2,
		"weight": 1100
	},
	{
		"sourceNode": 0,
		"destinationNode": 3,
		"weight": 750
	},
	{
		"sourceNode": 0,
		"destinationNode": 4,
		"weight": 500
	},
	{
		"sourceNode": 0,
		"destinationNode": 5,
		"weight": 1000
	},
	{
		"sourceNode": 0,
		"destinationNode": 6,
		"weight": 1200
	},
	{
		"sourceNode": 0,
		"destinationNode": 7,
		"weight": 1300
	},
	{
		"sourceNode": 0,
		"destinationNode": 8,
		"weight": 1100
	},
	{
		"sourceNode": 0,
		"destinationNode": 9,
		"weight": 1400
	},
	{
		"sourceNode": 1,
		"destinationNode": 0,
		"weight": 950
	},
	{
		"sourceNode": 1,
		"destinationNode": 2,
		"weight": 350
	},
	{
		"sourceNode": 1,
		"destinationNode": 3,
		"weight": 300
	},
	{
		"sourceNode": 1,
		"destinationNode": 4,
		"weight": 500
	},
	{
		"sourceNode": 1,
		"destinationNode": 5,
		"weight": 700
	},
	{
		"sourceNode": 1,
		"destinationNode": 6,
		"weight": 100
	},
	{
		"sourceNode": 1,
		"destinationNode": 7,
		"weight": 150
	},
	{
		"sourceNode": 1,
		"destinationNode": 8,
		"weight": 650
	},
	{
		"sourceNode": 1,
		"destinationNode": 9,
		"weight": 750
	},
	{
		"sourceNode": 2,
		"destinationNode": 0,
		"weight": 1100
	},
	{
		"sourceNode": 2,
		"destinationNode": 1,
		"weight": 350
	},
	{
		"sourceNode": 2,
		"destinationNode": 3,
		"weight": 450
	},
	{
		"sourceNode": 2,
		"destinationNode": 4,
		"weight": 650
	},
	{
		"sourceNode": 2,
		"destinationNode": 5,
		"weight": 800
	},
	{
		"sourceNode": 2,
		"destinationNode": 6,
		"weight": 1200
	},
	{
		"sourceNode": 2,
		"destinationNode": 7,
		"weight": 400
	},
	{
		"sourceNode": 2,
		"destinationNode": 8,
		"weight": 1000
	},
	{
		"sourceNode": 2,
		"destinationNode": 9,
		"weight": 1100
	},
	{
		"sourceNode": 3,
		"destinationNode": 0,
		"weight": 700
	},
	{
		"sourceNode": 3,
		"destinationNode": 1,
		"weight": 300
	},
	{
		"sourceNode": 3,
		"destinationNode": 2,
		"weight": 450
	},
	{
		"sourceNode": 3,
		"destinationNode": 4,
		"weight": 300
	},
	{
		"sourceNode": 3,
		"destinationNode": 5,
		"weight": 400
	},
	{
		"sourceNode": 3,
		"destinationNode": 6,
		"weight": 800
	},
	{
		"sourceNode": 3,
		"destinationNode": 7,
		"weight": 450
	},
	{
		"sourceNode": 3,
		"destinationNode": 8,
		"weight": 900
	},
	{
		"sourceNode": 3,
		"destinationNode": 9,
		"weight": 900
	},
    {
		"sourceNode": 4,
		"destinationNode": 0,
		"weight": 500
	},


	{
		"sourceNode": 4,
		"destinationNode": 1,
		"weight": 500
	},


        {
		"sourceNode": 4,
		"destinationNode": 2,
		"weight": 650
	},
        
        {
		"sourceNode": 4,
		"destinationNode": 3,
		"weight": 350
	},

        {
		"sourceNode": 4,
		"destinationNode": 5,
		"weight": 600
	},

        {
		"sourceNode": 4,
		"destinationNode": 6,
		"weight": 800
	},

        {
		"sourceNode": 4,
		"destinationNode": 7,
		"weight": 600
	},

        
        {
		"sourceNode": 4,
		"destinationNode": 8,
		"weight": 700
	},
          
        
        {
		"sourceNode": 4,
		"destinationNode": 9,
		"weight": 1100
	},
    {
		"sourceNode": 5,
		"destinationNode": 0,
		"weight": 1100
	},


	{
		"sourceNode": 5,
		"destinationNode": 1,
		"weight": 700
	},


        {
		"sourceNode": 5,
		"destinationNode": 2,
		"weight": 600
	},
        
        {
		"sourceNode": 5,
		"destinationNode": 3,
		"weight": 500
	},

        {
		"sourceNode": 5,
		"destinationNode": 4,
		"weight": 750
	},

        {
		"sourceNode": 5,
		"destinationNode": 6,
		"weight": 600
	},

        {
		"sourceNode": 5,
		"destinationNode": 7,
		"weight": 850
	},
    
    {
		"sourceNode": 5,
		"destinationNode": 8,
		"weight": 1400
	},
          
        {
		"sourceNode": 5,
		"destinationNode": 9,
		"weight": 1400
	},
    {
		"sourceNode": 6,
		"destinationNode": 0,
		"weight": 1200
	},


	{
		"sourceNode": 6,
		"destinationNode": 1,
		"weight": 1100
	},


        {
		"sourceNode": 6,
		"destinationNode": 2,
		"weight": 1200
	},
        
        {
		"sourceNode": 6,
		"destinationNode": 3,
		"weight": 650
	},

        {
		"sourceNode": 6,
		"destinationNode": 4,
		"weight": 800
	},

        {
		"sourceNode": 6,
		"destinationNode": 5,
		"weight": 600
	},

        {
		"sourceNode": 6,
		"destinationNode": 7,
		"weight": 1200
	},

        
        {
		"sourceNode": 6,
		"destinationNode": 8,
		"weight": 1400
	},
          
        
        {
		"sourceNode": 6,
		"destinationNode": 9,
		"weight": 1700
	},
    {
		"sourceNode": 7,
		"destinationNode": 0,
		"weight": 1400
	},
	{
		"sourceNode": 7,
		"destinationNode": 1,
		"weight": 150
	},
	{
		"sourceNode": 7,
		"destinationNode": 2,
		"weight": 400
	},
	{
		"sourceNode": 7,
		"destinationNode": 3,
		"weight": 450
	},
	{
		"sourceNode": 7,
		"destinationNode": 4,
		"weight": 700
	},
	{
		"sourceNode": 7,
		"destinationNode": 5,
		"weight": 850
	},
	{
		"sourceNode": 7,
		"destinationNode": 6,
		"weight": 1300
	},
	{
		"sourceNode": 7,
		"destinationNode": 8,
		"weight": 550
	},
	{
		"sourceNode": 7,
		"destinationNode": 9,
		"weight": 600
	},
    {
		"sourceNode": 8,
		"destinationNode": 0,
		"weight": 800
	},
	{
		"sourceNode": 8,
		"destinationNode": 1,
		"weight": 650
	},
	{
		"sourceNode": 8,
		"destinationNode": 2,
		"weight": 1000
	},
	{
		"sourceNode": 8,
		"destinationNode": 3,
		"weight": 950
	},
	{
		"sourceNode": 8,
		"destinationNode": 4,
		"weight": 750
	},
	{
		"sourceNode": 8,
		"destinationNode": 5,
		"weight": 1300
	},
	{
		"sourceNode": 8,
		"destinationNode": 6,
		"weight": 1400
	},
	{
		"sourceNode": 8,
		"destinationNode": 7,
		"weight": 550
	},
	{
		"sourceNode": 8,
		"destinationNode": 9,
		"weight": 800
	},
    {
		"sourceNode": 9,
		"destinationNode": 1,
		"weight": 750
	},
	{
		"sourceNode": 9,
		"destinationNode": 2,
		"weight": 1100
	},
	{
		"sourceNode": 9,
		"destinationNode": 3,
		"weight": 1000
	},
	{
		"sourceNode": 9,
		"destinationNode": 4,
		"weight": 1000
	},
	{
		"sourceNode": 9,
		"destinationNode": 5,
		"weight": 1500
	},
	{
		"sourceNode": 9,
		"destinationNode": 6,
		"weight": 1700
	},
	{
		"sourceNode": 9,
		"destinationNode": 7,
		"weight": 600
	},
	{
		"sourceNode": 9,
		"destinationNode": 8,
		"weight": 800
	}
]

/**
 * Obtine todos los caminos posibles
 * @param {GraphVertex} startVertex
 * @param {GraphVertex[][]} [paths]
 * @param {GraphVertex[]} [path]
 */
function findAllPaths(startVertex, paths = [], path = []) {
    // Clona la ruta
    const currentPath = [...path];
  
    //Agrega el nodo de inicio a la ruta.
    currentPath.push(startVertex);
  
    // Genera un conjunto visitado a partir de la ruta.
    const visitedSet = currentPath.reduce((accumulator, vertex) => {
        const updatedAccumulator = { ...accumulator };

        updatedAccumulator[vertex.getKey()] = vertex;
    
        return updatedAccumulator;
    }, {});
  
    // Obtiene todos los vecinos no visitados del nodo inicial
    const unvisitedNeighbors = startVertex.getNeighbors().filter((neighbor) => {
        return !visitedSet[neighbor.getKey()];
    });
  
    // Si no hay vecinos no visitados, trata la ruta actual como completa y la guarda.
    if (!unvisitedNeighbors.length) {
        paths.push(currentPath);
    
        return paths;
    }
  
    // Ir a través de todos los vecinos.
    for (let neighborIndex = 0; neighborIndex < unvisitedNeighbors.length; neighborIndex += 1) {
        const currentUnvisitedNeighbor = unvisitedNeighbors[neighborIndex];
        findAllPaths(currentUnvisitedNeighbor, paths, currentPath);
    }
  
    return paths;
}
  
/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @return {number}
 */
function getCycleWeight(adjacencyMatrix, verticesIndices, cycle) {
    let weight = 0;
  
    for (let cycleIndex = 1; cycleIndex < cycle.length; cycleIndex += 1) {
        const fromVertex = cycle[cycleIndex - 1];
        const toVertex = cycle[cycleIndex];
        const fromVertexIndex = verticesIndices[fromVertex.getKey()];
        const toVertexIndex = verticesIndices[toVertex.getKey()];
        weight += adjacencyMatrix[fromVertexIndex][toVertexIndex];
    }
  
    return weight;
}
  
/**
 * Enfoque de FUERZA BRUTA para resolver el problema del viajante de comercio.
 *
 * @param {Graph} graph
 * @return {GraphVertex[]}
 */
function bfTravellingSalesman(graph) {

    // Elije el punto de partida desde donde recorreremos el grafo.
    const startVertex = graph.getAllVertices()[0];
  
    // FUERZA BRUTA.
    // Genera todos los caminos posibles desde el nodo inicial.
    const allPossiblePaths = findAllPaths(startVertex);
  
    // Filtre las rutas que no sean ciclos.
    const allPossibleCycles = allPossiblePaths.filter((path) => {
        /** @var {GraphVertex} */
        const lastVertex = path[path.length - 1];
        const lastVertexNeighbors = lastVertex.getNeighbors();
    
        return lastVertexNeighbors.includes(startVertex);
    });
  
    // Revise todos los ciclos posibles y elije el que tenga el peso total mínimo del recorrido.
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const verticesIndices = graph.getVerticesIndices();
    let salesmanPath = [];
    let salesmanPathWeight = null;

    for (let cycleIndex = 0; cycleIndex < allPossibleCycles.length; cycleIndex += 1) {
        const currentCycle = allPossibleCycles[cycleIndex];
        const currentCycleWeight = getCycleWeight(adjacencyMatrix, verticesIndices, currentCycle);
    
        // Si el peso del ciclo actual es más pequeño que los anteriores tratan el ciclo actual como el más óptimo.
        if (salesmanPathWeight === null || currentCycleWeight < salesmanPathWeight) {
            salesmanPath = currentCycle;
            salesmanPathWeight = currentCycleWeight;
        }
    }
  
    // Devuelve la solución.
    return salesmanPath;
}

let vertices = []

nodos.forEach(element => {

	if ((element.id == 0) ||(element.id == 1) || (element.id == 2) || (element.id == 3) || (element.id == 4) || (element.id == 5) || (element.id == 6)) {

		vertices.push(new GraphVertex(element.id, element.name, element.lat, element.lng))
		
	}
	
	

});

const esteEsGraph = new Graph();

edges.forEach(element => {
	
	vertices.forEach(v1 => {


		vertices.forEach(v2 => {

			if ((v1.id == element.sourceNode) && (v2.id == element.destinationNode)) {
				
				esteEsGraph.addEdge(new GraphEdge(v1, v2, element.weight))

			}
			
		});
		
	});

});


/* const vertexA = new GraphVertex(0, "nombrex", 2479219, 2148902134);
const vertexB = new GraphVertex(1, "nombrex", 2479219, 2148902134);
const vertexC = new GraphVertex(2, "nombrex", 2479219, 2148902134);
const vertexD = new GraphVertex(3, "nombrex", 2479219, 2148902134);

const edgeAB = new GraphEdge(vertexA, vertexB, 1);
const edgeBD = new GraphEdge(vertexB, vertexD, 1);
const edgeDC = new GraphEdge(vertexD, vertexC, 1);
const edgeCA = new GraphEdge(vertexC, vertexA, 1);

const edgeBA = new GraphEdge(vertexB, vertexA, 5);
const edgeDB = new GraphEdge(vertexD, vertexB, 8);
const edgeCD = new GraphEdge(vertexC, vertexD, 7);
const edgeAC = new GraphEdge(vertexA, vertexC, 4);
const edgeAD = new GraphEdge(vertexA, vertexD, 2);
const edgeDA = new GraphEdge(vertexD, vertexA, 3);
const edgeBC = new GraphEdge(vertexB, vertexC, 3);
const edgeCB = new GraphEdge(vertexC, vertexB, 9);

const graph = new Graph();
graph
.addEdge(edgeAB)
.addEdge(edgeBD)
.addEdge(edgeDC)
.addEdge(edgeCA)
.addEdge(edgeBA)
.addEdge(edgeDB)
.addEdge(edgeCD)
.addEdge(edgeAC)
.addEdge(edgeAD)
.addEdge(edgeDA)
.addEdge(edgeBC)
.addEdge(edgeCB); */

console.log(esteEsGraph)

const salesmanPath = bfTravellingSalesman(esteEsGraph);


console.log(salesmanPath)