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
export default function bfTravellingSalesman(graph) {

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