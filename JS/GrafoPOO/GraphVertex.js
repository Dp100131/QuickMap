import LinkedList from '../util/dataStructures/LinkedList.js'
import LinkedListNode from '../util/dataStructures/LinkedListNode.js';
import GraphEdge from './GraphEdge.js';


export default class GraphVertex {

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